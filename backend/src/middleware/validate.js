import { ZodError } from 'zod';

// Returns middleware that validates req.body against a Zod schema
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      });
    }
    next(err);
  }
};
