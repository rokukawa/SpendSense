// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

function verifyJWT (req, res, next){
    const token = req.session.token;
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err){
            return res.status(500).redirect('login')
        }
        req.userId = decoded.user;
        next();
    })
}

// criar usuario
export const getCriarUsuario = async (req, res) => {    
    res.render('criar-usuario')
}

// criar usuario post
export const postCriarUsuario = async (req, res) => {
    const Usuario = require('../../models/usuario');

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