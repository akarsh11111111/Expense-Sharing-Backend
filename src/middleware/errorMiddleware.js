// 404 handler - resource nahin mila
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Resource not found',
    path: req.originalUrl
  })
}

// Centralized error handler - saare errors yahin handle hote hain

const errorHandler = (err, req, res, next) => {
  // Basic logging; real setup mein isse kisi logging service ko bheja ja sakta hai
  
  console.error(err)

  const status = err.status || 500
  res.status(status).json({
    message: err.message || 'Internal server error'
  })
}

module.exports = {
  notFoundHandler,
  errorHandler
}


