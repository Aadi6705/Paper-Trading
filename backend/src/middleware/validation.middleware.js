const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      const err = new Error(error.errors.map(e => e.message).join(', '));
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      return next(err);
    }
    next(error);
  }
};
module.exports = validate;
