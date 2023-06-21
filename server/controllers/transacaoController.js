// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
const axios = require('axios');

// API REST
// Listar 
export const getTransacao = async (req, res) => {   
    const Conta = require('../../models/conta');
    const Transacao = require('../../models/transacao');

    const { id } = req.params

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

    const schema = require('../validators/transacao')
    const {data, valor, descricao, categoria, conta} = req.body

    const result = schema.validate({data:data, valor:valor, descricao: descricao})
    
    if (result.error){
        res.json({status: false, mensagem: result.error.message})
    }else{
        res.json({status: true, transacao: await Transacao.save(data, valor, descricao, categoria, conta)})
    }
}

// Editar
export const putTransacao = async (req, res) => {   
    const Transacao = require('../../models/transacao');
    const schema = require('../validators/transacao');
    
    const {data, valor, descricao, categoria, id} = req.params

    const result = schema.validate({data:data, valor:valor, descricao: descricao})
    if (result.error){
        res.json({status: false, mensagem: result.error.message})
    }else{
        let obj = await Transacao.update(id, data, valor, descricao, categoria)
        if (obj[0] == 0) {
            return res.json({status: false, msg: "Falha ao editar transação."})
        }
        res.json({status: true, transacao: await Transacao.getById(id)});
    }
}

// Excluir
export const deleteTransacao = async (req, res) => {   
    const Transacao = require('../../models/transacao');
    
    const {id} = req.params

    let obj = await Transacao.delete(id)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Falha ao excluir transação."})
    }
    
    res.json({status: true, msg: "Exclusão com sucesso."});
}


// API CLIENTE
// criar transacao
export const getCriarTransacao = async (req, res) => {   
    const token = jwt.decode(req.session.token);

    const response = await axios.get("http://localhost:3001/conta/" + token.user);

    const data = response.data.conta
    
    const usuario = []

    data.forEach(data => {
        usuario.push({ id: data.id, nome_conta: data.nome_conta })
    });

    res.render('criar-transacao', { usuario })
}

// criar transacao post
export const postCriarTransacao = async (req, res) => {
    const { data, valor, descricao, categoria, conta } = req.body

    try {
        const response = await axios.post("http://localhost:3001/transacao/criar", 
            {
                data,
                valor,
                descricao,
                categoria,
                conta
            }
        );
        if(response.data.status){
            res.render('home');
        }else{
            res.render('criar-transacao', {mensagem: response.data.mensagem});
        }
    } catch (error) {
        console.log(error.response.data);
    }
}

// listar transacao 
export const getListarTransacao = async (req, res) => {

    try {
        const token = jwt.decode(req.session.token);
        const response = await axios.get("http://localhost:3001/transacao/" + token.user);
        const data = response.data.transacao

        res.render('listar-transacao', { data })
    } catch (error) {
        console.log(error.response.data);
    }
}

// listar transacao
export const postListarTransacao = async (req, res) => {
    const { id, data_transacao, valor, descricao, categoria, editar } = req.body
  
    if(editar !== undefined){
        const response = await axios.put(`http://localhost:3001/transacao/editar/${id}/${data_transacao}/${valor}/${descricao}/${categoria}`);
        
        if(response.data.status){
            res.redirect('/')
        }else{
            const token = jwt.decode(req.session.token);
            const transacao = await axios.get("http://localhost:3001/transacao/" + token.user);
            const data = transacao.data.transacao

            res.render('listar-transacao', { data: data, mensagem: response.data.mensagem })
        }
    }else{
        await axios.delete(`http://localhost:3001/transacao/deletar/${id}`);
        res.redirect('/')
    }
}