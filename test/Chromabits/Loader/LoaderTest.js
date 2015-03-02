"use strict";

var Loader = require('../../../src/Chromabits/Loader/Loader');

describe('Chromabits/Loader/Loader', () => {
    it('should be a constructor', () => {
        let instance = new Loader();

        instance.should.be.instanceOf(Loader);
    })
});
