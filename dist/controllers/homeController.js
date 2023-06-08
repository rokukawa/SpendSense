"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSobre = exports.getPortfolio = exports.getLogin = exports.getHome = exports.getFerramentasTecnologias = exports.getContato = void 0;
//login
const getLogin = (req, res, next) => {
  const path = require('path');
  res.render('login');
};

//home
exports.getLogin = getLogin;
const getHome = (req, res, next) => {
  res.render('home');
};

//sobre
exports.getHome = getHome;
const getSobre = (req, res, next) => {
  res.render('sobre');
};

//ferramenta e tecnologia
exports.getSobre = getSobre;
const getFerramentasTecnologias = (req, res, next) => {
  res.render('ferramentas-tecnologias');
};

//portfólio
exports.getFerramentasTecnologias = getFerramentasTecnologias;
const getPortfolio = (req, res, next) => {
  res.render('portfolio');
};

//contato
exports.getPortfolio = getPortfolio;
const getContato = (req, res, next) => {
  res.render('contato');
};
exports.getContato = getContato;