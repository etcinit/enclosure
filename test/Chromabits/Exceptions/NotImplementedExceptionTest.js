'use strict';

import NotImplementedException from
'../../../src/Chromabits/Exceptions/NotImplementedException';

describe('NotImplementedException', () => {
    it('should be a constructor', () => {
        let instance = new NotImplementedException();

        let instanceTwo = new NotImplementedException("wow");
    });
});
