/** @type {import('@babel/core').TransformOptions} */
module.exports = {
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    },
  },
}
