exports.xsignature_body = function(api, next) {

  api.connections.addCreateCallback(function(connection) {
    if(connection.mockBody && connection.mockBody != '') {
      connection.rawConnection.rawRequestBodyData = Buffer(connection.mockBody, 'utf8');
    } else {
      if(connection.type === 'web') {
        if(connection.rawConnection.req.method == 'GET') {
          connection.rawConnection.rawRequestBodyData = Buffer(connection.rawConnection.req.url, 'utf8');
        } else {
          connection.rawConnection.rawRequestBodyData = Buffer('');
          connection.rawConnection.req.on('data', function(buffer) {
            connection.rawConnection.rawRequestBodyData = Buffer.concat([connection.rawConnection.rawRequestBodyData, buffer]);
          });
        }
      }
    }
  });

  next();
}