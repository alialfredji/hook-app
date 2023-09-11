const { resetState } = require('../src/state');
const hookApp = require('../src/create-app');
const { registerAction } = require('../src/register-action');
const constants = require('../src/constants');

describe('hooks/create-app', () => {
    beforeEach(resetState);

    it('should run an empty app', async () => {
        await hookApp();
    });

    it('should register a service or feature from an ES module', async () => {
        const handler = jest.fn();

        const s1 = {
            register: () => {
                handler();
            },
        };

        await hookApp({
            services: [s1],
            features: [s1],
        });

        expect(handler.mock.calls.length).toBe(2);
    });

    it('should register a service or feature from a function', async () => {
        const handler = jest.fn();
        const s1 = () => handler();

        await hookApp({
            services: [s1],
            features: [s1],
        });

        expect(handler.mock.calls.length).toBe(2);
    });

    it('should register a service as single hook setup', async () => {
        const handler = jest.fn();
        const s1 = [ 'foo', handler ];
        const f1 = ({ createHook }) => createHook('foo');

        await hookApp({
            services: [s1],
            features: [f1],
        });

        expect(handler.mock.calls.length).toBe(1);
    });

    it('should run an app that provides settings as a function', async () => {
        await hookApp({
            settings: ({ setConfig }) => {
                setConfig('foo.faa', 22);
            },
            features: [
                [
                    constants.START_FEATURE,
                    ({ getConfig }) => expect(getConfig('foo.faa')).toBe(22),
                ],
            ],
        });
    });

    it('should provide a config getter to any registered action', async () => {
        await hookApp({
            settings: ({ setConfig }) => {
                setConfig('foo.faa', 22);
            },
            services: [
                // register a feature
                ({ registerAction }) =>
                    registerAction({
                        hook: constants.INIT_SERVICE,
                        handler: ({ getConfig, setConfig }) =>
                            setConfig('foo', getConfig('foo.faa') * 2),
                    }),
            ],
            features: [
                // register a single action
                [
                    constants.START_FEATURE,
                    ({ getConfig }) => expect(getConfig('foo')).toBe(44),
                ],
            ],
        });
    });

    it('should lock a context and decorate it with internal methods', async () => {
        await hookApp({
            settings: {
                increment: 1,
            },
            context: {
                foo: (args, ctx) => args.value + ctx.getConfig('increment'),
            },
            services: [
                [
                    constants.START_SERVICE,
                    async ({ createHook }) => {
                        const r1 = createHook.sync('aaa', { value: 1 });
                        expect(r1[0][0]).toBe(2);

                        const r2 = await createHook.serie('bbb', { value: 1 });
                        expect(r2[0][0]).toBe(2);

                        const r3 = await createHook.parallel('ccc', { value: 1 });
                        expect(r3[0][0]).toBe(2);
                    },
                ],
            ],
            features: [
                [ 'aaa', (args, ctx) => ctx.foo(args, ctx) ],
                [ 'bbb', (args, ctx) => ctx.foo(args, ctx) ],
                [ 'ccc', (args, ctx) => ctx.foo(args, ctx) ],
            ],
        });
    });

    describe('createHookApp getters / setters', () => {
        it('SETTINGS should not pass reference to the internal object', async () => {
            registerAction(constants.SETTINGS, ({ settings }) => {
                expect(settings).toBe(undefined);
            });
            await hookApp({ settings: { foo: 1 } });
        });

        it('should handle settings with getters/setters', async () => {
            registerAction(constants.SETTINGS, ({ getConfig, setConfig }) => {
                setConfig('foo', getConfig('foo') + 1);
            });
            const app = await hookApp({ settings: { foo: 1 } });
            expect(app.settings.foo).toBe(2);
        });

        it('should handle settings with nested paths', async () => {
            registerAction(constants.SETTINGS, ({ getConfig, setConfig }) => {
                setConfig('new.faa.foo', getConfig('foo') + 1);
            });
            const app = await hookApp({ settings: { foo: 1 } });
            expect(app.settings.new.faa.foo).toBe(2);
        });
    });

    describe('createHookApp / registerHook', () => {
        const s1 = ({ registerHook, registerAction, createHook }) => {
            registerHook({ S1: 's1' });
            registerAction({
                hook: '$START_SERVICE',
                handler: () => createHook.sync('s1'),
            });
        };

        it('should run a required service by reference', async () => {
            const handler = jest.fn();
            const f1 = [ '$S1', handler ];

            await hookApp({
                services: [s1],
                features: [f1],
            });

            expect(handler.mock.calls.length).toBe(1);
        });

        it('should fail to run a required service by reference', async () => {
            const handler = jest.fn();
            const f1 = [ '$S1', handler ];

            let error = null;
            try {
                await hookApp({
                    // services: [s1],
                    features: [f1],
                });
            } catch (e) {
                error = e;
            }

            expect(error.message).toBe('Unknown hook "S1"');
        });

        it('should ignore an optional service by reference', async () => {
            const handler = jest.fn();
            const f1 = [ '$S1?', handler ];

            await hookApp({
                // services: [s1],
                features: [f1],
            });

            expect(handler.mock.calls.length).toBe(0);
        });
    });

    describe('run all registerHook before registerAction', () => {
        it('Services and Features should be able to use nominal hooks to extend each other', async () => {
            const s1Handler = jest.fn();
            const s2Handler = jest.fn();

            const s1 = ({ registerHook, registerAction, createHook }) => {
                registerHook('s1', 's1');
                registerAction('$INIT_SERVICE', () => createHook.sync('s1'));
                registerAction('$s2', s2Handler);
            };

            const s2 = ({ registerHook, registerAction, createHook }) => {
                registerHook('s2', 's2');
                registerAction('$INIT_SERVICE', () => createHook.sync('s2'));
                registerAction('$s1', s1Handler);
            };

            await hookApp({ services: [ s1, s2 ] });

            expect(s1Handler.mock.calls.length).toBe(1);
            expect(s2Handler.mock.calls.length).toBe(1);
        });
    });
});
