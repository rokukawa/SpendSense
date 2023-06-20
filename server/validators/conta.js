const Joi = require('joi');

const schema = Joi.object({
    data_criacao: Joi.date().less('01-01-1900'),
    saldo: Joi.number().positive().required(),
    nome_conta: Joi.string().min(3).max(30).required()
})

module.exports = schema