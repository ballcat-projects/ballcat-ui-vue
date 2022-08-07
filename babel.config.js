module.exports = {
  presets: [
    '@vue/app',
    [
      '@babel/preset-env',
      {
        'useBuiltIns': 'entry',
        'corejs': '3' // 声明corejs版本
      }
    ]
  ]
}
