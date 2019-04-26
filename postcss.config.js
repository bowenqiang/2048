module.exports = {
    plugins: [
      require('autoprefixer')({
        grid: true,
        browsers: 'last 2 version, ios >= 10'
      })
    ]
  }