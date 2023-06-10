"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postEditarUsuario = exports.postCriarUsuario = exports.getEditarUsuario = exports.getCriarUsuario = void 0;
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

// criar usuario
const getCriarUsuario = async (req, res) => {
  res.render('criar-usuario');
};

// criar usuario post
exports.getCriarUsuario = getCriarUsuario;
const postCriarUsuario = async (req, res) => {
  const Usuario = require('../../models/usuario');
  const {
    nome,
    email,
    senha
  } = req.body;
  await Usuario.save(nome, email, senha);
  res.render('login');
};

// editar usuario
exports.postCriarUsuario = postCriarUsuario;
const getEditarUsuario = async (req, res, next) => {
  const token = jwt.decode(req.session.token);
  const Usuario = require('../../models/usuario');
  const data = await Usuario.getById(token.user);
  const {
    nome,
    email,
    senha
  } = data;
  res.render('editar-usuario', {
    nome: nome,
    email: email,
    senha: senha
  });
};

// editar e excluir usuario
exports.getEditarUsuario = getEditarUsuario;
const postEditarUsuario = async (req, res) => {
  const Usuario = require('../../models/usuario');
  const token = jwt.decode(req.session.token);
  const {
    name,
    email,
    password,
    editar
  } = req.body;
  if (editar !== undefined) {
    await Usuario.update(token.user, name, email, password);
    res.redirect('/');
  } else {
    await Usuario.delete(token.user);
    res.redirect('/login');
  }
};
exports.postEditarUsuario = postEditarUsuario;