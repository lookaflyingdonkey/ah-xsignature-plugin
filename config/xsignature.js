exports.default = { 
  xsignature: function(api){
    return {
      enabled: { // Which servers will make use of this, you can add your own custom ones in here too
        web: true,
        websocket: false,
        socket: false,
        testServer: false
      },
      expiry: 60 * 1000, // Expire checksum history in 1 Minute, set this to 0 to disable replay protection
      secret: 'changeme', // Change this for production, it is used to hash with the data to generate the signature,
      generateResponseHeader: true // Set to false to disable response signature generation
    }
  }
}

exports.test = { 
  xsignature: function(api){
    return {
      enabled: {
        web: false,
        websocket: false,
        socket: false,
        testServer: false
      },
      expiry: 15 * 60 * 1000, // 15 Minutes
      secret: 'changeme',
      generateResponseHeader: false
    }
  }
}

exports.production = { 
  xsignature: function(api){
    return {
      enabled: {
        web: true,
        websocket: true,
        socket: false,
        testServer: false
      },
      expiry: 60 * 60 * 24 * 1000, // 24 Hours
      secret: 'changeme',
      generateResponseHeader: true
    }
  }
}