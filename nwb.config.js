module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'Reactcardstack',
      externals: {
        react: 'React'
      }
    }
  },
  webpack: {
    extractCSS: {
      filename: 'react-cards-stack.css'
    }
  }
}
