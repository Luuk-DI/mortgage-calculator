/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

const stylistic = require('@stylistic/eslint-plugin');

const customized = stylistic.configs.customize({
  flat: false,
  indent: 2,
  quotes: 'single',
  semi: true,
  jsx: false,
});

module.exports = {
  root: true,
  env: {
    'node': true,
    'vue/setup-compiler-macros': true,
  },
  plugins: [
    '@stylistic',
  ],
  parser: 'vue-eslint-parser',
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    ...customized.rules,
    '@stylistic/brace-style': ['warn', '1tbs'],
    '@stylistic/member-delimiter-style': ['warn', { multiline: { delimiter: 'semi', requireLast: true } }],

    'no-trailing-spaces': 'warn',
    'quotes': ['warn', 'single'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': ['error', 'always'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      registeredComponentsOnly: true,
      ignores: [],
    }],

    'vue/define-emits-declaration': 'error',
    'vue/define-macros-order': 'warn',
    'vue/define-props-declaration': 'error',
    'vue/html-button-has-type': 'error',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
          normal: 'any',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/no-boolean-default': 'error',
    'vue/no-duplicate-attr-inheritance': 'error',
    'vue/no-required-prop-with-default': 'error',
    'vue/prefer-import-from-vue': 'error',
    'vue/prefer-true-attribute-shorthand': 'warn',
  },
};
