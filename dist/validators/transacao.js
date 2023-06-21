"use strict";

const Joi = require('joi');
const schema = Joi.object({
  data: Joi.date().greater('01-01-1900'),
  valor: Joi.number().positive().required(),
  descricao: Joi.string().min(3).max(30).required()
});
module.exports = schema;