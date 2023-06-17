// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

// API REST
// Listar 
export const getTransacao = async (req, res) => {   
    const Conta = require('../../models/conta');
    const Transacao = require('../../models/transacao');

    const id = req.body.id

    const obj = await Conta.getByUsuario(id)
    
    let contas = []
    obj.forEach(obj => {
        contas.push(obj.dataValues.id)
    });
    
    const value = await Transacao.getByConta(contas)
    if (!value) {
        return res.json({status: false, msg: "Transação não encontrada."})
    }

    return res.json({status: true, transacao: value})
}

// Criar
export const postTransacao = async (req, res) => {   
    const Transacao = require('../../models/transacao');
    const sequelize = require('../../db');
    await sequelize.sync()

    const {data, valor, descricao, categoria, conta} = req.body

    res.json({status: true, transacao: await Transacao.save(data, valor, descricao, categoria, conta)})
}

// Editar
export const putTransacao = async (req, res) => {   
    const Transacao = require('../../models/transacao');
    
    const {data, valor, descricao, categoria, id} = req.body

    let obj = await Transacao.update(id, data, valor, descricao, categoria)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Falha ao editar transação."})
    }
    
    res.json({status: true, transacao: await Transacao.getById(id)});
}

// Excluir
export const deleteTransacao = async (req, res) => {   
    const Transacao = require('../../models/transacao');
    
    const {id} = req.body

    let obj = await Transacao.delete(id)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Falha ao excluir transação."})
    }
    
    res.json({status: true, msg: "Exclusão com sucesso."});
}


// API CLIENTE
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
                categoria: transacoes.dataValues.categoria,
                id: transacoes.dataValues.id
            }
        )
    });

    res.render('listar-transacao', { data })
}


// editar e excluir transacao
export const postEditarExcluirTransacao = async (req, res) => {
    const Transacao = require('../../models/transacao');
    
    const token = jwt.decode(req.session.token)
    const {data, valor, descricao, categoria, id, editar} = req.body

    if(editar !== undefined){
        await Transacao.update(id, data, valor, descricao, categoria)
        res.redirect('/')
    }else{
        await Transacao.delete(id)
        res.redirect('/')
    }
}