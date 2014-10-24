exports.xsignature_middleware = function(api, next) {
  var signaturePreProcessor = function(connection, actionTemplate, next) {
    if(actionTemplate.validateSignature === true && api.config.xsignature.enabled[connection.type] && api.config.xsignature.enabled[connection.type] === true) {
      var rawString = connection.rawConnection.rawRequestBodyData.toString('utf8');
      console.log(connection.rawConnection.rawRequestBodyData.toString('utf8'));
      if("x-signature" in connection.rawConnection.req.headers) {
        var parts = connection.rawConnection.req.headers['x-signature'].split(' ');
        if(parts.length != 2) {
          connection.rawConnection.responseHttpCode = 403;
          connection.error = {
            code: 403,
            message: 'Signature format mismatch'
          };
          next(connection, false);
        } else {
          if(!api.xsignature.checkAlgorithm(parts[0])) {
            connection.rawConnection.responseHttpCode = 403;
            connection.error = {
              code: 403,
              message: 'Signature algorithm unavailable'
            };
            next(connection, false);
          } else {
            api.cache.load('signature_' + parts[1], function(err, value, expires, createdAt, readAt) {
              if(value === null) {
                var valid = api.xsignature.validate(parts[0], parts[1], rawString)
                if(!valid) {
                  connection.rawConnection.responseHttpCode = 403;
                  connection.error = {
                    code: 403,
                    message: 'Signature mismatch'
                  };
                  next(connection, false);
                } else {
                  api.cache.save('signature_' + parts[1], true, api.config.xsignature.expiry, function(err, isNew) {
                    connection.xsignature_algorithm = parts[0];
                    next(connection, true);
                  });
                }
              } else {
                connection.rawConnection.responseHttpCode = 403;
                connection.error = {
                  code: 403,
                  message: 'Signature already used'
                };
                next(connection, false);
              }
            });
          }
        }
      } else {
        connection.rawConnection.responseHttpCode = 403;
        connection.error = {
          code: 403,
          message: 'No Signature supplied'
        };
        next(connection, false);
      }
    } else {
      next(connection, true);
    }
  };
  
  var signaturePostProcessor = function(connection, actionTemplate, toRender, next) {
    if(actionTemplate.validateSignature === true && api.config.xsignature.enabled[connection.type] && api.config.xsignature.enabled[connection.type] === true) {
      connection.response.server_timestamp = new Date().getTime();
      var rawString = JSON.stringify(connection.response, null, api.config.servers.web.padding);
      var hash = api.xsignature.generate(connection.xsignature_algorithm, rawString);
      connection.rawConnection.responseHeaders.push(['X-Signature', hash]);
    }
    next(connection, true);
  };
  
  api.actions.addPreProcessor(signaturePreProcessor);
  api.actions.addPostProcessor(signaturePostProcessor);
  
  next();
}