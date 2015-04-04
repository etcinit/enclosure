/**
 * Enclosure Bootstrap Script
 *
 * This is the starting point of an Enclosure application.
 * Here we setup anything we need before Enclosure starts doing its thing.
 */
 var path = require('path');

// We want to use ES6 so we enable Babel's transpiler which will automagically
// transform ES6 files into ES5-level code
require('babel/register');

// Next, we tell Enclosure to start the application.
// Normally, we would use require('enclosure').boot(). However, since this
// project is inside the Enclosure repo itself, it is more convenient to load
// the library directly.
require('../src/index').boot({
    metadata: path.resolve(__dirname, '/package.json')
});
