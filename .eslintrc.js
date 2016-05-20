module.exports = {
    env: {
        'es6': true,
        'browser': true,
        'node': true
    },
    extends: 'eslint:recommended',
    globals: {
      draft: true
    },
    parserOptions: {
        'sourceType': 'module'
    },
    rules: {
      'no-console': 1,
      'valid-jsdoc': 1,

      'block-scoped-var': 2,
      'curly': 2,
      'default-case': 0,
      'dot-location': [
        2,
        'object'
      ],
      'dot-notation': 2,
      'eqeqeq': [
        1,
        'smart'
      ],
      'guard-for-in': 0,
      'no-caller': 2,
      'no-case-declarations': 2,
      'no-else-return': 1,
      'no-eq-null': 1,
      'no-eval': 2,
      'no-extend-native': 2,
      'no-extra-bind': 2,
      'no-floating-decimal': 2,
      'no-implied-eval': 2,
      'no-loop-func': 1,
      'no-multi-spaces': 2,
      'no-multi-str': 2,
      'no-native-reassign': 2,
      'no-new-func': 2,
      'no-new-wrappers': 1,
      'no-new': 2,
      'no-octal-escape': 2,
      'no-proto': 2,
      'no-redeclare': 2,
      'no-script-url': 2,
      'no-self-compare': 2,
      'no-sequences': 1,
      'no-throw-literal': 1,
      'no-unused-expressions': 2,
      'no-useless-call': 2,
      'no-useless-concat': 2,
      'no-with': 2,
      'radix': 2,
      'yoda': [
        1,
        'never',
        {
          'exceptRange': true
        }
      ],

      'no-shadow-restricted-names': 2,
      'no-shadow': 2,
      'no-undef-init': 2,
      'no-undef': 1,
      'no-unused-vars': 1,
      'no-use-before-define': 2,

      'array-bracket-spacing': 2,
      'block-spacing': 2,
      'brace-style': [
        2,
        '1tbs'
      ],
      'camelcase': 2,
      'comma-spacing': 2,
      'comma-style': 2,
      'computed-property-spacing': 2,
      'consistent-this': [
        1,
        'that'
      ],
      'eol-last': 2,
      'func-names': 0,
      'func-style': [
        1,
        'expression'
      ],
      'indent': [
        2,
        2,
        {
          'SwitchCase': 1
        }
      ],
      'key-spacing': 2,
      'keyword-spacing': 2,
      'linebreak-style': [
        2,
        'unix'
      ],
      'max-len': [
        1,
        80,
        2,
        {
          'ignoreUrls': true
        }
      ],
      'new-cap': 2,
      'new-parens': 2,
      'no-array-constructor': 2,
      'no-bitwise': 1,
      'no-inline-comments': 2,
      'no-lonely-if': 2,
      'no-negated-condition': 2,
      'no-nested-ternary': 1,
      'no-spaced-func': 2,
      'no-trailing-spaces': 2,
      'no-unneeded-ternary': 2,
      'object-curly-spacing': 2,
      'operator-assignment': [
        1,
        'always'
      ],
      'operator-linebreak': [
        2,
        'after'
      ],
      'quotes': [
        2,
        'single'
      ],
      'require-jsdoc': [
        0,
        {
          'require': {
            'FunctionDeclaration': true,
            'ClassDeclaration': true,
            'MethodDefinition': false
          }
        }
      ],
      'semi-spacing': 2,
      'semi': 2,
      'space-before-blocks': 2,
      'space-before-function-paren': [
        2,
        'never'
      ],
      'space-in-parens': 2,
      'space-infix-ops': 1,
      'space-unary-ops': 2,
      'spaced-comment': 2,
      'wrap-regex': 2,

      'arrow-body-style': 2,
      'arrow-spacing': 2,
      'constructor-super': 2,
      'generator-star-spacing': 0,
      'no-class-assign': 2,
      'no-confusing-arrow': 1,
      'no-const-assign': 2,
      'no-dupe-class-members': 2,
      'no-this-before-super': 2,
      'object-shorthand': [
        2,
        'methods'
      ],
      'prefer-const': 0,
      'prefer-reflect': 0,
      'prefer-spread': 2,
      'prefer-template': 2
    }
};
