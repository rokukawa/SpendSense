"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putTransacao = exports.postTransacao = exports.postListarTransacao = exports.postCriarTransacao = exports.getTransacao = exports.getListarTransacao = exports.getCriarTransacao = exports.deleteTransacao = void 0;
// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
const axios = require('axios');

// API REST
// Listar 
const getTransacao = async (req, res) => {
  const Conta = require('../../models/conta');
  const Transacao = require('../../models/transacao');
  const {
    id
  } = req.params;
  const obj = await Conta.getByUsuario(id);
  let contas = [];
  obj.forEach(obj => {
    contas.push(obj.dataValues.id);
  });
  const value = await Transacao.getByConta(contas);
  if (!value) {
    return res.json({
      status: false,
      msg: "Transação não encontrada."
    });
  }
  return res.json({
    status: true,
    transacao: value
  });
};

// Criar
exports.getTransacao = getTransacao;
const postTransacao = async (req, res) => {
  const Transacao = require('../../models/transacao');
  const sequelize = require('../../db');
  await sequelize.sync();
  const {
    data,
    valor,
    descricao,
    categoria,
    conta
  } = req.body;
  res.json({
    status: true,
    transacao: await Transacao.save(data, valor, descricao, categoria, conta)
  });
};

// Editar
exports.postTransacao = postTransacao;
const putTransacao = async (req, res) => {
  const Transacao = require('../../models/transacao');
  const {
    data,
    valor,
    descricao,
    categoria,
    id
  } = req.params;
  console.log(req.params);
  let obj = await Transacao.update(id, data, valor, descricao, categoria);
  if (obj[0] == 0) {
    return res.json({
      status: false,
      msg: "Falha ao editar transação."
    });
  }
  res.json({
    status: true,
    transacao: await Transacao.getById(id)
  });
};

// Excluir
exports.putTransacao = putTransacao;
const deleteTransacao = async (req, res) => {
  const Transacao = require('../../models/transacao');
  const {
    id
  } = req.params;
  let obj = await Transacao.delete(id);
  if (obj[0] == 0) {
    return res.json({
      status: false,
      msg: "Falha ao excluir transação."
    });
  }
  res.json({
    status: true,
    msg: "Exclusão com sucesso."
  });
};

// API CLIENTE
// criar transacao
exports.deleteTransacao = deleteTransacao;
const getCriarTransacao = async (req, res) => {
  const token = jwt.decode(req.session.token);
  const response = await axios.get("http://localhost:3001/conta/" + token.user);
  const data = response.data.conta;
  const usuario = [];
  data.forEach(data => {
    usuario.push({
      id: data.id,
      nome_conta: data.nome_conta
    });
  });
  res.render('criar-transacao', {
    usuario
  });
};

// criar transacao post
exports.getCriarTransacao = getCriarTransacao;
const postCriarTransacao = async (req, res) => {
  const {
    data,
    valor,
    descricao,
    categoria,
    conta
  } = req.body;
  try {
    const response = await axios.post("http://localhost:3001/transacao/criar", {
      data,
      valor,
      descricao,
      categoria,
      conta
    });
    res.render('home');
  } catch (error) {
    console.log(error.response.data);
  }
};

// listar transacao 
exports.postCriarTransacao = postCriarTransacao;
const getListarTransacao = async (req, res) => {
  const token = jwt.decode(req.session.token);
  try {
    const response = await axios.get("http://localhost:3001/transacao/" + token.user);
    const data = response.data.transacao;
    res.render('listar-transacao', {
      data
    });
  } catch (error) {
    console.log(error.response.data);
  }
};

// listar transacao
exports.getListarTransacao = getListarTransacao;
const postListarTransacao = async (req, res) => {
  const {
    id,
    data_transacao,
    valor,
    descricao,
    categoria,
    editar
  } = req.body;
  if (editar !== undefined) {
    await axios.put(`http://localhost:3001/transacao/editar/${id}/${data_transacao}/${valor}/${descricao}/${categoria}`);
    res.redirect('/');
  } else {
    await axios.delete(`http://localhost:3001/transacao/deletar/${id}`);
    res.redirect('/');
  }
};
exports.postListarTransacao = postListarTransacao;