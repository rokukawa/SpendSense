//login
export const getLogin = (req, res, next) => {
    const path = require('path');
    res.render('login')
}

//home
export const getHome = (req, res, next) => {
    res.render('home')
};

//sobre
export const getSobre = (req, res, next) => {
    res.render('sobre')
};

//ferramenta e tecnologia
export const getFerramentasTecnologias = (req, res, next) => {
    res.render('ferramentas-tecnologias')
};

//portfólio
export const getPortfolio = (req, res, next) => {
    res.render('portfolio')
};

//contato
export const getContato = (req, res, next) => {
    res.render('contato')
};
