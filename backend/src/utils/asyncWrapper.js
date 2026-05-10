// Wraps async route handlers — eliminates try/catch boilerplate
const asyncWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncWrapper;
