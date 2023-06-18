"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postLogout = exports.postLogin = exports.postContato = exports.getSobre = exports.getPortfolio = exports.getLogin = exports.getHome = exports.getFerramentasTecnologias = exports.getContato = void 0;
// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

// função para envio de email
const nodemailer = require("nodemailer");

// login
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
  res.render('home');
};

// sobre
exports.getHome = getHome;
const getSobre = (req, res) => {
  res.render('sobre');
};

// ferramenta e tecnologia
exports.getSobre = getSobre;
const getFerramentasTecnologias = (req, res) => {
  res.render('ferramentas-tecnologias');
};

// portfólio
exports.getFerramentasTecnologias = getFerramentasTecnologias;
const getPortfolio = (req, res) => {
  res.render('portfolio');
};

// contato
exports.getPortfolio = getPortfolio;
const getContato = (req, res) => {
  res.render('contato');
};

// .replace(",", "").replace('"', "").replace('"', "")
// contato
exports.getContato = getContato;
const transporter = nodemailer.createTransport({
  host: process && process.env && process.env.NDM_HOST || "\"smtp.gmail.com\",",
  port: process && process.env && process.env.NDM_PORT || "\"587\",",
  secure: false,
  auth: {
    user: process && process.env && process.env.NDM_USER || "\"emailweb2utfpr@gmail.com\",",
    pass: process && process.env && process.env.NDM_PASS || "EmailWeb2_UTFPR"
  }
});
const postContato = async (req, res) => {
  const {
    name,
    email,
    subject,
    message
  } = req.body;
  await transporter.sendMail({
    text: message,
    subject: subject,
    from: process && process.env && process.env.NDM_USER || "\"emailweb2utfpr@gmail.com\",",
    to: process && process.env && process.env.NDM_USER || "\"emailweb2utfpr@gmail.com\","
  });
  res.redirect('/');
};
exports.postContato = postContato;