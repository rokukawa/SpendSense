const Joi = require("joi")

const DefaultSchema = Joi.object({
    nome: Joi.string()
        .min(3)
        .max(30)
        .required(),
    idade: Joi.number()
    .integer()
    .greater(0),
}).with("nome", "idade")

module.exports = DefaultSchema