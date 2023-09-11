const { resetState } = require('../src/state');
const { createHook } = require('../src/create-hook');
const { registerAction } = require('../src/register-action');

describe('hooks/sync', () => {
    beforeEach(resetState);

    it('should run hooks', () => {
        const handler = jest.fn();
        registerAction({
            hook: 'foo',
            handler,
        });
        createHook('foo');
        expect(handler.mock.calls.length).toBe(1);
    });

    it('should log action names', () => {
        const ac1 = { hook: 'foo', name: 'ac1', handler: () => 22 };
        const ac2 = {
            hook: 'foo',
            handler: function ac2() {
                return 23;
            },
        };

        registerAction(ac1);
        registerAction(ac2);

        const results = createHook('foo');

        expect(results[0][0]).toBe(22);
        expect(results[0][1].name).toBe('ac1');
        expect(results[1][0]).toBe(23);
        expect(results[1][1].name).toBe('ac2');
    });

    it('should run sync hooks with helper function', () => {
        const handler = jest.fn();
        registerAction({
            hook: 'foo',
            handler,
        });
        createHook.sync('foo');
        expect(handler.mock.calls.length).toBe(1);
    });
});
