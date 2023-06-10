// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

// login
export const getLogin = async (req, res) => {
    res.render('login')
}

// login post
export const postLogin = async (req, res) => {
    const Usuario = require('../../models/usuario');

    const {nome, email, senha} = req.body
    const data = await Usuario.getByEmailSenha(email, senha)

    if (data != null){
        const token = jwt.sign(
            {user: data.id}, 
            process.env.SECRET, 
            {expiresIn: '1 hr'}
        );

        req.session.status = true;
        req.session.token = token;
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
}

// logout
export const postLogout = (req, res) => { 
    req.session.status = false;
    req.session.token = '';

    res.redirect('/login')
}

// home
export const getHome = (req, res) => {
    res.render('home');
};

// sobre
export const getSobre = (req, res) => {
    res.render('sobre');
};

// ferramenta e tecnologia
export const getFerramentasTecnologias = (req, res) => {
    res.render('ferramentas-tecnologias')
};

// portfólio
export const getPortfolio = (req, res) => {
    res.render('portfolio')
};

// contato
export const getContato = (req, res) => {
    res.render('contato')
};
