class CustomError extends Error {
  constructor(message, status, originalError = null) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
    this.originalError = originalError;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = (err, req, res, next) => {
    console.error(err);
    if (err instanceof CustomError) {
      return res.status(err.status).json({ message: err.message, error: err.originalError ? err.originalError.message : null });
    } else if (err.code === 'ER_DUP_ENTRY') { 
      return res.status(400).json({ message: 'Duplicate entry', error: err.message });
    }
    res.status(err.status || 500).json({ message: err.message || 'Server error' });
  };

module.exports.CustomError = CustomError;
  