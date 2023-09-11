const { resetState } = require('../src/state');
const { createHook } = require('../src/create-hook');
const { registerAction } = require('../src/register-action');

describe('hooks/serie', () => {
    beforeEach(resetState);

    it('should run parallel hooks', async () => {
        const handler = jest.fn();
        registerAction({
            hook: 'foo',
            handler: async () => {
                handler();
            },
        });
        await createHook('foo', { mode: 'parallel' });
        expect(handler.mock.calls.length).toBe(1);
    });

    it('should run parallel hooks with helper', async () => {
        const spy = jest.fn();
        const handler = async () => {
            spy();
        };

        registerAction({
            hook: 'foo',
            handler,
        });
        registerAction([ 'foo', handler ]);
        registerAction('foo', handler);

        await createHook.parallel('foo');
        expect(spy.mock.calls.length).toBe(3);
    });
});
