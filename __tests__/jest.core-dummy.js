// Tell jest that it should always return the real module specified in require
jest.unmock('../lib/core.js');

// Describe test
describe('core.dummy', () => {
    it('returns given string', () => {
        const core = require('../lib/core.js');

        expect(core.dummy('It works!')).toBe('It works!');
    });
});
