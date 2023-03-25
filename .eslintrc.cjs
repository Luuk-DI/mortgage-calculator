/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true,
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    '@typescript-eslint/indent': ['warn', 2, { 'SwitchCase': 1 }],
    'no-trailing-spaces': 'warn',
    'quotes': ['warn', 'single'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': ['error', 'always'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      'registeredComponentsOnly': true,
      'ignores': []
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
