module.exports = {
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': ['eslint:recommended', 'plugin:react/recommended'],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        '__PRODUCTION__': 'readonly',
        '__protocol__': 'readonly',
        '__server__': 'readonly',
        'require': 'readonly',
        'ActiveXObject': 'readonly'
    },
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'rules': {
        'indent': 'off',
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'eqeqeq': 'error',
        'no-empty': ['error', {'allowEmptyCatch': true}]
    }
};
