// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

// criar conta
export const getCriarConta = async (req, res) => {    
    res.render('criar-conta')
}

// criar conta post
export const postCriarConta = async (req, res) => {
    const Conta = require('../../models/conta');
    const Usuario = require('../../models/usuario');
    const sequelize = require('../../db');
    await sequelize.sync()

    const token = jwt.decode(req.session.token)

    const {nome_conta, categoria, saldo, data_criacao} = req.body

    await Conta.save(nome_conta, categoria, saldo, data_criacao, token.user)

    res.render('home')
}