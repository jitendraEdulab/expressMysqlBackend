const Joi = require('joi');

const userRegisterSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required',
    'string.empty': 'Username cannot be empty'
  }),
  fullname: Joi.string().required().regex(/^[a-zA-Z ]+$/).messages({
    'any.required': 'Fullname is required',
    'string.empty': 'Fullname cannot be empty',
    'string.pattern.base': 'Fullname cannot contain numbers or special characters'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty'
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Invalid email format'
  }),
});

const userLoginSchema = Joi.object({  
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Invalid email format'
  }),  
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password cannot be empty'
  })
})

module.exports = {userRegisterSchema,userLoginSchema};
