"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postLogin = exports.postCriarConta = exports.getSobre = exports.getPortfolio = exports.getLogin = exports.getHome = exports.getFerramentasTecnologias = exports.getCriarConta = exports.getContato = void 0;
// criar conta
const getCriarConta = async (req, res, next) => {
  res.render('criar-conta');
};

// criar conta post
exports.getCriarConta = getCriarConta;
const postCriarConta = async (req, res, next) => {
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
const getLogin = async (req, res, next) => {
  res.render('login');
};

// login post
exports.getLogin = getLogin;
const postLogin = async (req, res, next) => {
  const bd = require('../../db');
  const Usuario = require('../../models/usuario');
  const jwt = require("jsonwebtoken");
  const {
    nome,
    email,
    senha
  } = req.body;
  const result = await Usuario.getByEmail(email);
  if (result) {
    const token = jwt.sign({
      user: result
    }, process && process.env && process.env.SECRET || "web2", {
      expiresIn: '1 hr'
    });
    res.render('home');
  }
};

// home
exports.postLogin = postLogin;
const getHome = (req, res, next) => {
  res.render('home');
};

// sobre
exports.getHome = getHome;
const getSobre = (req, res, next) => {
  res.render('sobre');
};

// ferramenta e tecnologia
exports.getSobre = getSobre;
const getFerramentasTecnologias = (req, res, next) => {
  res.render('ferramentas-tecnologias');
};

// portfólio
exports.getFerramentasTecnologias = getFerramentasTecnologias;
const getPortfolio = (req, res, next) => {
  res.render('portfolio');
};

// contato
exports.getPortfolio = getPortfolio;
const getContato = (req, res, next) => {
  res.render('contato');
};
exports.getContato = getContato;