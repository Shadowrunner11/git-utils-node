function tryRequireOrNull(path) {
  try {
    return require(path)
  }
  catch(_error) {
    return null
  }
}

function getConfig({configPath, root = process.cwd()} = {}) {
  const { join } = require('node:path')

  const { checkConfig } = tryRequireOrNull(join(root, 'package.json')) ?? {}

  return ( {
    ...checkConfig,
    ...tryRequireOrNull(configPath ?? join(root, 'check.config.json')),
    ...tryRequireOrNull(join(root, 'check.config.cjs')),
    ...tryRequireOrNull(join(root, 'check.config.js'))
  })
}


module.exports = {
  getConfig
}