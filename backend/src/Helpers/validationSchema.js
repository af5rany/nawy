const joi = require("joi");

const schema = joi.object({
  email: joi
    .string()
    .pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
    .required(),
  name: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  userName: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  role: joi.string().valid("parent", "guest").required(),
  phoneNumber: joi
    .string()
    // .pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  confirmPassword: joi.ref("password"),
});

const passwordSchema = joi.object({
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  confirmPassword: joi.ref("password"),
});

const verifySignUp = async (req, res, next) => {
  const {
    email,
    name,
    userName,
    role,
    phoneNumber,
    password,
    confirmPassword,
  } = req.body;
  try {
    await schema.validateAsync({
      email,
      userName,
      name,
      role,
      phoneNumber,
      password,
      confirmPassword,
    });
  } catch (err) {
    return next(err);
  }
  next();
};

module.exports = { schema, verifySignUp, passwordSchema };
