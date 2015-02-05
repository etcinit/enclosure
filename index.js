"use strict";

var Container = require('./src/Chromabits/Container/Container'),
    Wrap = require('./src/Chromabits/Container/Wrap'),
    ClassMap = require('./src/Chromabits/Mapper/ClassMap.js'),
    DirectoryMapper = require('./src/Chromabits/Mapper/DirectoryMapper.js');

module.exports = {
    Container: Container,
    Wrap: Wrap,
    Chromabits: {
        Mapper: {
            ClassMap: ClassMap,
            DirectoryMapper: DirectoryMapper
        }
    }
};
