const prettierRules = {
    "parser": "typescript",
    "trailingComma": "es5",
    "tabWidth": 2,
    "semi": false,
    "singleQuote": true,
    "jsxSingleQuote": true
}

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
        jasmine: true
    },
    extends: [
        "eslint:recommended",
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    rules: {
        "@typescript-eslint/explicit-function-return-type": {
            allowExpressions: true
        },
        "@typescript-eslint/no-use-before-define": {
            functions: false
        },
        "prettier/prettier": ["error", prettierRules]
    },
};