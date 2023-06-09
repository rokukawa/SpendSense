
// criar conta
export const getCriarConta = async (req, res, next) => {    
    res.render('criar-conta')
}

// criar conta post
export const postCriarConta = async (req, res, next) => {
    const bd = require('../../db');
    const Usuario = require('../../models/usuario');
    await bd.sync()

    const {nome, email, senha} = req.body

    // implementar validação de email duplicado
    await Usuario.save(nome, email, senha)
    
    res.render('login')
}

// login
export const getLogin = async (req, res, next) => {
    res.render('login')
}

// login post
export const postLogin = async (req, res, next) => {
    const bd = require('../../db');
    const Usuario = require('../../models/usuario');
    const jwt = require("jsonwebtoken")

    const {nome, email, senha} = req.body

    const result = await Usuario.getByEmail(email)

    if (result){
        const token = jwt.sign({user: result}, process.env.SECRET, {expiresIn: '1 hr'});
        res.render('home')
    }
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
