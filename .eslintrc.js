module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    //'no-console': 'error',  // 本番
    'no-console': 'off',    // 開発
    //'no-debugger': 'error', // 本番
    'no-debugger': 'off',   // 開発
    'prettier/prettier': [
      'error',
      {
        singleQuote: true, // 引用符としてシングルクオートを使用する (false)
        semi: true, // 式の最後にセミコロンを付加する (true)
        printWidth: 100 // 行の最大長 (80)
      }
    ]
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
