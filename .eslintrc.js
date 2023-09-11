module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        jest: true,
        node: true,
    },
    extends: 'eslint:recommended',
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                '.eslintrc.{js,cjs}',
            ],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: [ 2, 4, { SwitchCase: 1 } ],
        'comma-dangle': [ 'error', 'always-multiline' ],
        'array-bracket-spacing': [ 'error', 'always', { singleValue: false } ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        quotes: [
            'error',
            'single',
        ],
        semi: [
            'error',
            'always',
        ],
        'no-async-promise-executor': 'off',
        'no-case-declarations': 'off',
    },
};

