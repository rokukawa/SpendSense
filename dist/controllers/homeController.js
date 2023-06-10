"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postLogout = exports.postLogin = exports.postCriarConta = exports.getSobre = exports.getPortfolio = exports.getLogin = exports.getHome = exports.getFerramentasTecnologias = exports.getCriarConta = exports.getContato = void 0;
// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
function verifyJWT(req, res, next) {
  const token = req.session.token;
  jwt.verify(token, process && process.env && process.env.SECRET || "web2", (err, decoded) => {
    if (err) {
      return res.status(500).redirect('login');
    }
    req.userId = decoded.user;
    next();
  });
}

// criar conta
const getCriarConta = async (req, res) => {
  res.render('criar-conta');
};

// criar conta post
exports.getCriarConta = getCriarConta;
const postCriarConta = async (req, res) => {
  const bd = require('../../db');
  const Usuario = require('../../models/usuario');
  await bd.sync();
  const {
    nome,
    email,
    senha
  } = req.body;

  // implementar validação de email duplicado
  await Usuario.save(nome, email, senha);
  res.render('login');
};

// login
exports.postCriarConta = postCriarConta;
const getLogin = async (req, res) => {
  res.render('login');
};

// login post
exports.getLogin = getLogin;
const postLogin = async (req, res) => {
  const Usuario = require('../../models/usuario');
  const {
    nome,
    email,
    senha
  } = req.body;
  const data = await Usuario.getByEmailSenha(email, senha);
  if (data != null) {
    const token = jwt.sign({
      user: data.id
    }, process && process.env && process.env.SECRET || "web2", {
      expiresIn: '1 hr'
    });
    req.session.status = true;
    req.session.token = token;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
};

// logout
exports.postLogin = postLogin;
const postLogout = (req, res) => {
  req.session.status = false;
  req.session.token = '';
  res.redirect('/login');
};

// home
exports.postLogout = postLogout;
const getHome = (req, res) => {
  verifyJWT(req, res, () => {
    res.render('home');
  });
};

// sobre
exports.getHome = getHome;
const getSobre = (req, res) => {
  verifyJWT(req, res, () => {
    res.render('sobre');
  });
};

// ferramenta e tecnologia
exports.getSobre = getSobre;
const getFerramentasTecnologias = (req, res) => {
  verifyJWT(req, res, () => {
    res.render('ferramentas-tecnologias');
  });
};

// portfólio
exports.getFerramentasTecnologias = getFerramentasTecnologias;
const getPortfolio = (req, res) => {
  verifyJWT(req, res, () => {
    res.render('portfolio');
  });
};

// contato
exports.getPortfolio = getPortfolio;
const getContato = (req, res) => {
  verifyJWT(req, res, () => {
    res.render('contato');
  });
};
exports.getContato = getContato;