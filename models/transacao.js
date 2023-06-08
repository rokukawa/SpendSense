const Sequelize = require('sequelize');
const Conta = require('./conta');
const db = require('../db');

const TransacaoModel = db.define('transacao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    data_transacao: {
        type: Sequelize.STRING,
        allowNull: true
    },
    valor: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

TransacaoModel.belongsTo(Conta.Model, {
    foreignKey: 'conta'
})
Usuario.Model.hasMany(TransacaoModel, {foreignKey: 'conta'})

module.exports = {
    list: async function() {
        const transacao = await TransacaoModel.findAll()
        return transacao
    },
    
    save: async function(data_transacao, valor, descricao, categoria) {
        const transacao = await TransacaoModel.create({
            data_transacao: data_transacao,
            valor: valor,
            descricao: descricao,
            categoria: categoria
        })
        
        return transacao
    },

    update: async function(id, data_transacao, valor, descricao, categoria) {
        return await TransacaoModel.update(
            {
                data_transacao: data_transacao, 
                valor: valor, 
                descricao: descricao, 
                categoria: categoria
            }, 
            {
                where: { id: id }
            }
        )
    },

    delete: async function(id) {
        return await TransacaoModel.destroy({where: { id: id }})
    },

    getById: async function(id) {
        return await TransacaoModel.findByPk(id)
    },

    getByConta: async function(transacao) {
        return await TransacaoModel.findOne({where: {transacao: {
            [Sequelize.Op.like]: '%' + transacao + '%'
        } }})
    },

    Model: TransacaoModel
}
