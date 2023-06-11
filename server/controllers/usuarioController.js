// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

// criar usuario
export const getCriarUsuario = async (req, res) => {    
    res.render('criar-usuario')
}

// criar usuario post
export const postCriarUsuario = async (req, res) => {
    const Usuario = require('../../models/usuario');
    const sequelize = require('../../db');
    await sequelize.sync()

    const {nome, email, senha} = req.body

    await Usuario.save(nome, email, senha)
    
    res.render('login')
}

// editar usuario
export const getEditarUsuario = async (req, res, next) => {
    const token = jwt.decode(req.session.token)
    const Usuario = require('../../models/usuario');

    const data = await Usuario.getById(token.user)
    const {nome, email, senha} = data

    res.render('editar-usuario', { nome: nome, email: email, senha: senha })
}

// editar e excluir usuario
export const postEditarUsuario = async (req, res) => {
    const Usuario = require('../../models/usuario');
    
    const token = jwt.decode(req.session.token)
    const {name, email, password, editar} = req.body

    if(editar !== undefined){
        await Usuario.update(token.user, name, email, password)
        res.redirect('/')
    }else{
        await Usuario.delete(token.user)
        res.redirect('/login')
    }
}