'use strict';

import ServiceProvider from '../../../src/Chromabits/Container/ServiceProvider';

describe('ServiceProvider', () => {
    describe('#register', () => {
        it('should throw an exception when its not overriden', () => {
            let instance = new ServiceProvider();

            () => {
                instance.register();
            }.should.throw();
        });
    });

    describe('#provides', () => {
        it('should return an empty array by default', () => {
            let instance = new ServiceProvider();

            instance.provides().length.should.be.equal(0);
        });
    });
});
