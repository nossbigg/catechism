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
        "prettier/prettier": ["error", prettierRules],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "fp/no-unused-expression": "off",
        "fp/no-rest-parameters": "off",
        "fp/no-nil": "off"
    },
};