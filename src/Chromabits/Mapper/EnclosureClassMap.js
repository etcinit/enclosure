'use strict';

var DirectoryMapper = require('./DirectoryMapper'),

    path = require('path');

var mapper = new DirectoryMapper(path.resolve(__dirname, '../../'));

module.exports = mapper.generate();
