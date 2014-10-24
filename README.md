# ah-xsignature-plugin

Adds and validated content HMAC signatures for the request and response bodies, used to stop replay attacks.

## Installation
- Install the plugin with npm-install ah-xsignature-plugin --save
- Add the plugin "ah-xsignature-plugin" to your ActionHero config

A xsignature config file will be copied into your config folder with the settings available for this plugin.

## Usage
This plugin will check your action templates for a property called "validateSignature", if it exists and is true it will then require a X-Signature HTTP header. The header format is "{algorithm} {HMAC}", where {algorithm} can be any of the hashing algorithms available from the node crypto module (NOTE: I do validate that the algorithm is available on the system so you cannot pass through junk).

For a GET request it will hash the URL component minus any protocol, host and port along with your secret. For example http://www.google.com/search?q=Monkies would hash "{SECRET}/search?q=Monkies" to validate a signature.

For a POST request it will validate the whole content body as a string, this is done from the raw request so it will be exactly as you has sent it from your server before ActionHero does anything to it.

This plugin will also append server_timestamp to the response params and generate a X-Signature response header, this can be used client side to ensure that the message hasn't changed in transit. This can be disabled by setting the "generateResponseHeader" config value to false.