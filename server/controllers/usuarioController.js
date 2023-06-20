// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
const axios = require('axios');

// validação com Joi
const schema = require('../validators/usuario');


// API REST
// Lista
export const getUsuario = async (req, res) => {  
    const Usuario = require('../../models/usuario');

    const { id } = req.params

    const obj = await Usuario.getById(id)

    if (!obj) {
        return res.json({status: false, msg: "Conta não encontrada."})
    }

    return res.json({status: true, conta: obj})  
}

// Criar
export const postUsuario = async (req, res) => {   
    const Usuario = require('../../models/usuario');
    const sequelize = require('../../db');
    await sequelize.sync()
    
    const schema = require('../validators/usuario')

    const result = schema.validate(req.body)
    if (result.error){
        res.json({status: false, mensagem: result.error.message})
    }else{
        const {nome, email, senha} = req.body
        res.json({status: true, usuario: await Usuario.save(nome, email, senha)})
    }
}

// Editar
export const putUsuario = async (req, res) => {   
    const Usuario = require('../../models/usuario');
    const schema = require('../validators/usuario')

    const {id, nome, email, senha} = req.params

    const result = schema.validate({nome:nome, email:email, senha:senha})
    if (result.error){
        res.json({status: false, mensagem: result.error.message})
    }else{
        let obj = await Usuario.update(id, nome, email, senha)
        if (obj[0] == 0) {
            return res.json({status: false, mensagem: "Falha ao editar usuário."})
        }
        res.json({status: true, conta: await Usuario.getById(id)});
    }
}

// Excluir
export const deleteUsuario = async (req, res) => {   
    const Usuario = require('../../models/usuario');

    const {id} = req.params
    
    let obj = await Usuario.delete(id)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Falha ao excluir conta."})
    }
    
    res.json({status: true, msg: "Exclusão com sucesso."});
}


// API CLIENTE
// criar usuario
export const getCriarUsuario = async (req, res) => {    
    res.render('criar-usuario')
}

export const postCriarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const response = await axios.post("http://localhost:3001/usuario/criar", 
            {
                nome,
                email,
                senha
            }
        );
        if(response.data.status){
            res.render('login');
        }else{
            res.render('criar-usuario', {mensagem: response.data.mensagem});
        }
    } catch (error) {
        console.log(error.response.data);
    }
}

// editar usuario
export const getEditarUsuario = async (req, res, next) => {
    const token = jwt.decode(req.session.token);

    const usuario = token.user

    try {
        const response = await axios.get("http://localhost:3001/usuario/" + usuario);
        res.render('editar-usuario', {data: response.data.conta});
    } catch (error) {
        console.log(error.response.data);
    }
}

// listar usuario
export const postListarUsuario = async (req, res) => {

    const { id, nome, email, senha, editar } = req.body

    if(editar !== undefined){
        const response = await axios.put(`http://localhost:3001/usuario/editar/${id}/${nome}/${email}/${senha}`);
        if(response.data.status){
            res.redirect('/')
        }else{
            const token = jwt.decode(req.session.token);
            const usuario = token.user        
            const user = await axios.get("http://localhost:3001/usuario/" + usuario);
            res.render('editar-usuario', {data: user.data.conta, mensagem: response.data.mensagem});
        }
    }else{
        await axios.delete(`http://localhost:3001/usuario/deletar/${id}`);
        res.redirect('/login')
    }
}