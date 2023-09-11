
# @alialfredji/hook-app

`@alialfredji/hook-app` is a dynamic framework designed to supercharge your Node.js applications. It offers a traceable, debuggable, and modular approach to build and manage your applications. Inspired by the flexibility of WordPress plugins, it provides a simple plugin system that supports both synchronous and asynchronous extension points. Forget about infrastructure and focus on business logic.

## Installation

Getting started is as simple as:

```bash
npm install @alialfredji/hook-app
```

Or if you're a Yarn enthusiast:

```bash
yarn add @alialfredji/hook-app
```

Craft a basic hello world hook app:

```javascript

const hookApp = require('@alialfredji/hook-app');

const feature1 = ({ registerAction, registerHook }) => {
    const defaults = {
        name: 'feature1',
        trace: __dirname,
    };

    registerHook({ testHook: 'testHook' });

    registerAction({
        ...defaults,
        hook: '$INIT_FEATURE',
        handler: ({ knownHooks, createHook }) => {
            createHook.sync(knownHooks.testHook, {
                hello: 'Hello World!',
            });
        },
    });
};

const feature2 = ({ registerAction }) => {
    const defaults = {
        name: 'feature1',
        trace: __dirname,
    };

    registerAction({
        ...defaults,
        hook: '$testHook',
        handler: ({ hello }) => {
            console.log('testHook payload:', hello);
        },
    });
};

hookApp.run({
    trace: true,
    features: [
        feature1,
        feature2,
    ],
    services: [],
    settings: {},
});

/*
Result in console
---------------------

testHook payload: Hello World!

=================
Boot Trace:
=================

▶ feature1 ◇ init::feature
  ▶ feature1 » testHook
♦ app/trace ◇ finish
*/

```

## Key Concepts

- **Hooks (Extension Points)**: Controlled entry points that allow external components to inject business logic seamlessly.
- **Actions (Extensions)**: External functionalities that inject into hooks.
- **Boot Phases**: Lifecycle of the Hook App, categorized into phases: Startup, Initialization, Start, and Cleanup.




