const Joi = require('@hapi/joi');

const schema = Joi.object({
  _id: Joi
    .string()
    .allow(''),

  firstName: Joi.string()
    .regex(new RegExp(/^[\p{L}\s]*$/iu), 'Please write your name in format: John Doe')
    .min(2)
    .max(255)
    .required(),

  lastName: Joi.string()
    .regex(new RegExp(/^[\p{L}\s]*$/iu), 'Please write your name in format: John Doe')
    .min(2)
    .max(255)
    .required(),

  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2
      , /*tlds: { allow: ['com', 'net'] }*/
    }),

  role: Joi.string().valid('artist', 'designer', 'art_manager').allow('art_manager')

}).required();

module.exports = schema;
