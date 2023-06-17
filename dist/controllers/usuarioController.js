"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putUsuario = exports.postUsuario = exports.postEditarExcluirUsuario = exports.postCriarUsuario = exports.getUsuario = exports.getEditarUsuario = exports.getCriarUsuario = exports.deleteUsuario = void 0;
// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

// API REST
// Lista
const getUsuario = async (req, res) => {
  const Usuario = require('../../models/usuario');
  const token = jwt.decode(req.session.token);
  const {
    email,
    senha
  } = req.body;
  const obj = await Usuario.getByEmailSenha(email, senha);
  if (!obj) {
    return res.json({
      status: false,
      msg: "Conta não encontrada."
    });
  }
  return res.json({
    status: true,
    conta: obj
  });
};

// Criar
exports.getUsuario = getUsuario;
const postUsuario = async (req, res) => {
  const Usuario = require('../../models/usuario');
  const sequelize = require('../../db');
  await sequelize.sync();
  const {
    nome,
    email,
    senha
  } = req.body;
  res.json({
    status: true,
    usuario: await Usuario.save(nome, email, senha)
  });
};

// Editar
exports.postUsuario = postUsuario;
const putUsuario = async (req, res) => {
  const Usuario = require('../../models/usuario');
  const token = jwt.decode(req.session.token);
  const {
    id,
    nome,
    email,
    senha
  } = req.body;
  let obj = await Usuario.update(id, nome, email, senha);
  if (obj[0] == 0) {
    return res.json({
      status: false,
      msg: "Falha ao editar usuário."
    });
  }
  res.json({
    status: true,
    conta: await Usuario.getById(id)
  });
};

// Excluir
exports.putUsuario = putUsuario;
const deleteUsuario = async (req, res) => {
  const Usuario = require('../../models/usuario');
  const token = jwt.decode(req.session.token);
  let obj = await Usuario.delete(token.user);
  if (obj[0] == 0) {
    return res.json({
      status: false,
      msg: "Falha ao excluir conta."
    });
  }
  res.json({
    status: true,
    msg: "Exclusão com sucesso."
  });
};

// API CLIENTE
// criar usuario
exports.deleteUsuario = deleteUsuario;
const getCriarUsuario = async (req, res) => {
  res.render('criar-usuario');
};

// criar usuario post
exports.getCriarUsuario = getCriarUsuario;
const postCriarUsuario = async (req, res) => {
  const Usuario = require('../../models/usuario');
  const sequelize = require('../../db');
  await sequelize.sync();
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
const postEditarExcluirUsuario = async (req, res) => {
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
exports.postEditarExcluirUsuario = postEditarExcluirUsuario;