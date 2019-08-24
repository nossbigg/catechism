const prettierRules = require('./.prettierrc')

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    env: {
        browser: true,
        node: true,
        jasmine: true,
        es6: true
    },
    extends: [
        "eslint:recommended",
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'plugin:fp/recommended'
    ],
    plugins: ["fp", "react-hooks"],
    rules: {
        "@typescript-eslint/explicit-function-return-type": {
            allowExpressions: true
        },
        "@typescript-eslint/no-use-before-define": {
            functions: false
        },
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
            "ignoreRestSiblings": true
        }],
        "prettier/prettier": ["error", prettierRules],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/prop-types": 'off',
        "fp/no-unused-expression": "off",
        "fp/no-rest-parameters": "off",
        "fp/no-nil": "off"
    },
};