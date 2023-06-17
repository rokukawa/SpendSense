// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

// API REST
// Listar
export const getConta = async (req, res) => {    
    const Conta = require('../../models/conta');
    const token = jwt.decode(req.session.token);
    const obj = await Conta.getByUsuario(token.user)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Contas não encontrada."})
    }

    return res.json({status: true, conta: obj})
}

// Criar
export const postConta = async (req, res) => {    
    const Conta = require('../../models/conta');
    const sequelize = require('../../db');
    await sequelize.sync()

    const {nome_conta, tipo_conta, saldo, data_criacao} = req.body

    const token = jwt.decode(req.session.token)

    res.json({status: true, transacao: await Conta.save(nome_conta, tipo_conta, saldo, data_criacao, token.user)})
}

// Editar
export const putConta = async (req, res) => {    
    const Conta = require('../../models/conta');
        
    const {id, nome_conta, tipo_conta, saldo, data_criacao} = req.body

    let obj = await Conta.update(id, nome_conta, tipo_conta, saldo, data_criacao)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Falha ao editar conta."})
    }
    
    res.json({status: true, conta: await Conta.getById(id)});
}

// Deletar
export const deleteConta = async (req, res) => {    
    const Conta = require('../../models/conta');

    const {id} = req.body
    
    let obj = await Conta.delete(id)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Falha ao excluir conta."})
    }
    
    res.json({status: true, msg: "Exclusão com sucesso."});
}


// API CLIENTE
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