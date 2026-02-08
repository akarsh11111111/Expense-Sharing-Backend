const loadConfig = () => {
  return {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 4000
  }
}

module.exports = { loadConfig }


