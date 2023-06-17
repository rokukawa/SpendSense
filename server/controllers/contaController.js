// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
const axios = require('axios');

// API REST
// Listar
export const getConta = async (req, res) => {    
    const Conta = require('../../models/conta');

    const { usuario } = req.params

    const obj = await Conta.getByUsuario(usuario)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Contas não encontrada."})
    }

    return res.json({status: true, conta: obj})
}

// Criar
export const postConta = async (req, res) => {    
    const Conta = require('../../models/conta');
    const sequelize = require('../../db');
    await sequelize.sync()

    const {nome_conta, tipo_conta, saldo, data_criacao, id} = req.body

    res.json({status: true, conta: await Conta.save(nome_conta, tipo_conta, saldo, data_criacao, id)})
}

// Editar
export const putConta = async (req, res) => {    
    const Conta = require('../../models/conta');
        
    const {usuario, nome_conta, tipo_conta, saldo} = req.params
    console.log(req.params)

    let obj = await Conta.update(usuario, nome_conta, tipo_conta, saldo)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Falha ao editar conta."})
    }
    
    res.json({status: true, conta: await Conta.getById(usuario)});
}

// Deletar
export const deleteConta = async (req, res) => {    
    const Conta = require('../../models/conta');

    const {usuario} = req.params
    
    let obj = await Conta.delete(usuario)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Falha ao excluir conta."})
    }
    
    res.json({status: true, msg: "Exclusão com sucesso."});
}


// API CLIENTE
// criar conta 
export const getCriarConta = async (req, res) => {    
    res.render('criar-conta')
}

// criar conta
export const postCriarConta = async (req, res) => {
    const { nome_conta, tipo_conta, saldo, data_criacao } = req.body;
    const token = jwt.decode(req.session.token);

    const id = token.user

    try {
        const response = await axios.post("http://localhost:3001/conta/criar", 
            {
                nome_conta,
                tipo_conta,
                saldo,
                data_criacao,
                id
            }
        );
        res.render('home');
    } catch (error) {
        console.log(error.response.data);
    }
};

// listar conta
export const getListarConta = async (req, res) => {
    const token = jwt.decode(req.session.token);

    const usuario = token.user

    try {
        const response = await axios.get("http://localhost:3001/conta/" + usuario);
        res.render('listar-conta', {data: response.data.conta});
    } catch (error) {
        console.log(error.response.data);
    }
};

// editar e excluir conta
export const postListarConta = async (req, res) => {
    const token = jwt.decode(req.session.token);

    const { id, nome_conta, tipo_conta, saldo, editar } = req.body

    console.log(req.body)
  
    if(editar !== undefined){
        await axios.put(`http://localhost:3001/conta/editar/${id}/${nome_conta}/${tipo_conta}/${saldo}`);
        res.redirect('/')
    }else{
        await axios.delete(`http://localhost:3001/conta/deletar/${id}`);
        res.redirect('/')
    }
};