// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
const axios = require('axios');

// API REST
// Listar
export const getConta = async (req, res) => {    
    const Conta = require('../../models/conta');
    const obj = await Conta.getByUsuario(token.user)

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
        
    const {id, nome_conta, tipo_conta, saldo, data_criacao} = req.body

    let obj = await Conta.update(id, nome_conta, tipo_conta, saldo, data_criacao)

    if (obj[0] == 0) {
        return res.json({status: false, msg: "Falha ao editar conta."})
    }
    
    res.json({status: true, conta: await Conta.getById(id)});
}

// Deletar
export const deleteConta = async (req, res) => {    
    const Conta = require('../../models/conta');

    const {id} = req.body
    
    let obj = await Conta.delete(id)

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