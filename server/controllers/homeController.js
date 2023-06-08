
// criar conta
export const getCriarConta = async (req, res, next) => {
    const bd = require('../../db');
    const Usuario = require('../../models/usuario');
    await bd.sync()

    const {nome, email, senha} = req.query

    // implementar validação de email duplicado
    await Usuario.save(nome, email, senha)
    
    res.render('criar-conta')
}

// login
export const getLogin = async (req, res, next) => {
    const bd = require('../../db');
    const Usuario = require('../../models/usuario');

    const {nome, email, senha} = req.query

    const result = await Usuario.getByEmail(email)

    res.render('login')
}

// home
export const getHome = (req, res, next) => {
    res.render('home')
};

// sobre
export const getSobre = (req, res, next) => {
    res.render('sobre')
};

// ferramenta e tecnologia
export const getFerramentasTecnologias = (req, res, next) => {
    res.render('ferramentas-tecnologias')
};

// portfólio
export const getPortfolio = (req, res, next) => {
    res.render('portfolio')
};

// contato
export const getContato = (req, res, next) => {
    res.render('contato')
};
