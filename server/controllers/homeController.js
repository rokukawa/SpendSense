// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

function verifyJWT (req, res){
    const token = req.headers['x-access-token'];
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err){
            return res.status(500).redirect('/login')
        }
        req.userId = decoded.user;
        next();
    })
}

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

    const {nome, email, senha} = req.body

    const data = await Usuario.getByEmailSenha(email)

    if (data){
        const token = jwt.sign({user: data.id}, process.env.SECRET, {expiresIn: '1 hr'});
        req.session.status = true;
        req.session.token = token;
        res.redirect('/')
    } else {
        res.status(403).json({status:false})
    }
}

// home
export const getHome = (req, res, next) => {
    verifyJWT(req, res, () => {
        res.render('home');
    });
};

// sobre
export const getSobre = (req, res, next) => {
    verifyJWT(req, res, () => {
        res.render('sobre');
    });
};

// ferramenta e tecnologia
export const getFerramentasTecnologias = (req, res, next) => {
    verifyJWT(req, res, () => {
        res.render('ferramentas-tecnologias')
    });    
};

// portfólio
export const getPortfolio = (req, res, next) => {
    verifyJWT(req, res, () => {
        res.render('portfolio')
    });
};

// contato
export const getContato = (req, res, next) => {
    verifyJWT(req, res, () => {
        res.render('contato')
    });
};
