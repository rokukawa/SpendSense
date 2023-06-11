// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

// criar transacao
export const getCriarTransacao = async (req, res) => {   
    const Conta = require('../../models/conta');

    const token = jwt.decode(req.session.token);

    const data = await Conta.getByUsuario(token.user)

    const usuario = []

    data.forEach(data => {
        usuario.push({ id: data.dataValues.id, nome_conta: data.dataValues.nome_conta })
    });

    res.render('criar-transacao', { usuario })
}

// criar transacao post
export const postCriarTransacao = async (req, res) => {
    const Transacao = require('../../models/transacao');
    const sequelize = require('../../db');
    await sequelize.sync()

    const {data, valor, descricao, categoria, conta} = req.body

    await Transacao.save(data, valor, descricao, categoria, conta)
    
    res.render('home')
}

// listar transacao 
export const getListarTransacao = async (req, res) => {
    const Conta = require('../../models/conta');
    const Transacao = require('../../models/transacao');

    const token = jwt.decode(req.session.token);

    const contas = await Conta.getByUsuario(token.user)

    const ids = []

    contas.forEach(contas => {
        ids.push( contas.dataValues.id)
    });

    const transacoes = await Transacao.getByConta(ids);

    const data = []

    transacoes.forEach(transacoes => {
        data.push(
            { 
                data: transacoes.dataValues.data_transacao, 
                valor: transacoes.dataValues.valor, 
                descricao: transacoes.dataValues.descricao, 
                categoria: transacoes.dataValues.categoria
            }
        )
    });

    res.render('listar-transacao', { data })
}