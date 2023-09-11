const { resetState } = require('../src/state');
const { createHook } = require('../src/create-hook');
const { registerAction } = require('../src/register-action');

describe('hooks/serie', () => {
    beforeEach(resetState);

    it('should run serie hooks', async () => {
        const handler = jest.fn();
        registerAction({
            hook: 'foo',
            handler: async () => {
                handler();
            },
        });
        await createHook('foo', { mode: 'serie' });
        expect(handler.mock.calls.length).toBe(1);
    });

    it('should run serie hooks - with helper', async () => {
        const handler = jest.fn();
        registerAction({
            hook: 'foo',
            handler: async () => {
                handler();
            },
        });
        await createHook.serie('foo');
        expect(handler.mock.calls.length).toBe(1);
    });
});
