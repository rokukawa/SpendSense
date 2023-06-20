"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putConta = exports.postListarConta = exports.postCriarConta = exports.postConta = exports.getListarConta = exports.getCriarConta = exports.getConta = exports.deleteConta = void 0;
// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
const axios = require('axios');

// API REST
// Listar
const getConta = async (req, res) => {
  const Conta = require('../../models/conta');
  const {
    usuario
  } = req.params;
  const obj = await Conta.getByUsuario(usuario);
  if (obj[0] == 0) {
    return res.json({
      status: false,
      msg: "Contas não encontrada."
    });
  }
  return res.json({
    status: true,
    conta: obj
  });
};

// Criar
exports.getConta = getConta;
const postConta = async (req, res) => {
  const Conta = require('../../models/conta');
  const sequelize = require('../../db');
  await sequelize.sync();
  const schema = require('../validators/conta');
  const {
    nome_conta,
    tipo_conta,
    saldo,
    data_criacao,
    id
  } = req.body;
  const result = schema.validate({
    data_criacao: data_criacao,
    saldo: saldo,
    nome_conta: nome_conta
  });
  if (result.error) {
    res.json({
      status: false,
      mensagem: result.error.message
    });
  } else {
    res.json({
      status: true,
      conta: await Conta.save(nome_conta, tipo_conta, saldo, data_criacao, id)
    });
  }
};

// Editar
exports.postConta = postConta;
const putConta = async (req, res) => {
  const Conta = require('../../models/conta');
  const schema = require('../validators/conta');
  const {
    usuario,
    nome_conta,
    tipo_conta,
    saldo
  } = req.params;
  const result = schema.validate({
    saldo: saldo,
    nome_conta: nome_conta
  });
  if (result.error) {
    res.json({
      status: false,
      mensagem: result.error.message
    });
  } else {
    let obj = await Conta.update(usuario, nome_conta, tipo_conta, saldo);
    if (obj[0] == 0) {
      return res.json({
        status: false,
        msg: "Falha ao editar conta."
      });
    }
    res.json({
      status: true,
      conta: await Conta.getById(usuario)
    });
  }
};

// Deletar
exports.putConta = putConta;
const deleteConta = async (req, res) => {
  const Conta = require('../../models/conta');
  const {
    usuario
  } = req.params;
  let obj = await Conta.delete(usuario);
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
// criar conta 
exports.deleteConta = deleteConta;
const getCriarConta = async (req, res) => {
  res.render('criar-conta');
};

// criar conta
exports.getCriarConta = getCriarConta;
const postCriarConta = async (req, res) => {
  const {
    nome_conta,
    tipo_conta,
    saldo,
    data_criacao
  } = req.body;
  const token = jwt.decode(req.session.token);
  const id = token.user;
  try {
    const response = await axios.post("http://localhost:3001/conta/criar", {
      nome_conta,
      tipo_conta,
      saldo,
      data_criacao,
      id
    });
    if (response.data.status) {
      res.render('home');
    } else {
      res.render('criar-conta', {
        mensagem: response.data.mensagem
      });
    }
  } catch (error) {
    console.log(error.response.data);
  }
};

// listar conta
exports.postCriarConta = postCriarConta;
const getListarConta = async (req, res) => {
  const token = jwt.decode(req.session.token);
  const usuario = token.user;
  try {
    const response = await axios.get("http://localhost:3001/conta/" + usuario);
    res.render('listar-conta', {
      data: response.data.conta
    });
  } catch (error) {
    console.log(error.response.data);
  }
};

// editar e excluir conta
exports.getListarConta = getListarConta;
const postListarConta = async (req, res) => {
  const token = jwt.decode(req.session.token);
  const usuario = token.user;
  const {
    id,
    nome_conta,
    tipo_conta,
    saldo,
    editar
  } = req.body;
  if (editar !== undefined) {
    const response = await axios.put(`http://localhost:3001/conta/editar/${id}/${nome_conta}/${tipo_conta}/${saldo}`);
    if (response.data.status) {
      res.redirect('/');
    } else {
      const conta = await axios.get("http://localhost:3001/conta/" + usuario);
      res.render('listar-conta', {
        data: conta.data.conta,
        mensagem: response.data.mensagem
      });
    }
  } else {
    await axios.delete(`http://localhost:3001/conta/deletar/${id}`);
    res.redirect('/');
  }
};
exports.postListarConta = postListarConta;