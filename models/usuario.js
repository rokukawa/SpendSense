const Sequelize = require('sequelize');
const db = require('../db');

const UsarioModel = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = {
    list: async function() {
        const usuarios = await UsarioModel.findAll()
        return usuarios
    },
    
    save: async function(nome, email, senha) {
        const usuario = await UsarioModel.create(
            {
                nome: nome,
                email: email,
                senha: senha
            }
        )
        
        return usuario
    },

    update: async function(id, nome, email, senha) {
        return await UsarioModel.update(
            {
                nome: nome, 
                email: email, 
                senha: senha
            }, 
            {
                where: { id: id }
            }
        )
    },

    delete: async function(id) {
        return await UsarioModel.destroy({where: { id: id }})
    },

    getById: async function(id) {
        return await UsarioModel.findByPk(id)
    },

    getByEmailSenha: async function(email, senha) {
        return await UsarioModel.findOne(
            {where: 
                {
                    email: {[Sequelize.Op.like]: email}, 
                    senha: {[Sequelize.Op.like]: senha}
                }
            }
        )
    },

    Model: UsarioModel
}
