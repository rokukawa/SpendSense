const Sequelize = require('sequelize');
const Usuario = require('./usuario');
const db = require('../db');

const ContaModel = db.define('conta', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome_conta: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo_conta: {
        type: Sequelize.STRING,
        allowNull: false
    },
    saldo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    data_criacao: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

ContaModel.belongsTo(Usuario.Model, {foreignKey: 'usuario'})

module.exports = {
    list: async function() {
        const conta = await ContaModel.findAll()
        return conta
    },
    
    save: async function(nome_conta, tipo_conta, saldo, data_criacao, usuario) {
        const conta = await ContaModel.create({
            nome_conta: nome_conta,
            tipo_conta: tipo_conta,
            saldo: saldo,
            data_criacao: data_criacao,
            usuario: usuario
        })
        
        return conta
    },

    update: async function(id, nome_conta, tipo_conta, saldo, data_criacao) {
        return await ContaModel.update(
            {
                nome_conta: nome_conta, 
                tipo_conta: tipo_conta, 
                saldo: saldo, 
                data_criacao: data_criacao
            }, 
            {
                where: { id: id }
            }
        )
    },

    delete: async function(id) {
        return await ContaModel.destroy({where: { id: id }})
    },

    getById: async function(id) {
        return await ContaModel.findByPk(id)
    },

    getByUsuario: async function(usuario) {
        return await ContaModel.findAll({where: { usuario: usuario }})
    },

    getByConta: async function(conta) {
        return await ContaModel.findAll({where: { conta: conta }})
    },

    Model: ContaModel
}
