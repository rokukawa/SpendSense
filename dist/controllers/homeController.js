"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSobre = exports.getPortfolio = exports.getLogin = exports.getHome = exports.getFerramentasTecnologias = exports.getCriarConta = exports.getContato = void 0;
// criar conta
const getCriarConta = async (req, res, next) => {
  const bd = require('../../db');
  const Usuario = require('../../models/usuario');
  await bd.sync();
  const {
    nome,
    email,
    senha
  } = req.query;

  // implementar validação de email duplicado
  await Usuario.save(nome, email, senha);
  res.render('criar-conta');
};

// login
exports.getCriarConta = getCriarConta;
const getLogin = async (req, res, next) => {
  const bd = require('../../db');
  const Usuario = require('../../models/usuario');
  const {
    nome,
    email,
    senha
  } = req.query;
  const result = await Usuario.getByEmail(email);
  res.render('login');
};

// home
exports.getLogin = getLogin;
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