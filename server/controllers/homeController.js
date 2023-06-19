// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
const axios = require('axios');

// função para envio de email
const nodemailer = require("nodemailer");

// função para gerar dados fake
const faker = require('faker');

// função para exportar pdf
const { jsPDF } = require("jspdf");

// login
export const getLogin = async (req, res) => {
    res.render('login')
}

// login post
export const postLogin = async (req, res) => {
    const Usuario = require('../../models/usuario');

    const {nome, email, senha} = req.body
    const data = await Usuario.getByEmailSenha(email, senha)

    if (data != null){
        const token = jwt.sign({user: data.id}, process.env.SECRET, {expiresIn: '1 hr'});

        req.session.status = true;
        req.session.token = token;
        res.redirect('/')
    } else {
        res.redirect('/login')
    }
}

// logout
export const postLogout = (req, res) => { 
    req.session.status = false;
    req.session.token = '';

    res.redirect('/login')
}

// home
export const getHome = (req, res) => {
    res.render('home');
};

// sobre
export const getSobre = (req, res) => {
    res.render('sobre');
};

// ferramenta e tecnologia
export const getFerramentasTecnologias = (req, res) => {
    res.render('ferramentas-tecnologias')
};

// portfólio
export const getPortfolio = (req, res) => {
    res.render('portfolio')
};

// contato
export const getContato = (req, res) => {
    res.render('contato')
};

// contato
export const postContato = async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    const transporter = nodemailer.createTransport({
        host: process.env.NDM_HOST,
        port: process.env.NDM_PORT,
        secure: false,
        auth: {
            user: process.env.NDM_USER,
            pass: process.env.NDM_PASS
        }
    });

    const mailOptions = {
        from: process.env.NDM_USER,
        to: `${name} <${email}>`,
        subject: subject,
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send('<script>alert("Não foi possível enviar a mensagem."); window.location.href = "/contato";</script>');
        } else {
            res.send('<script>alert("Mensagem enviada com sucesso!"); window.location.href = "/contato";</script>');
        }
    });
};

// extrato
export const postExportExtrato = async (req, res) => {
    const doc = new jsPDF();
    const token = jwt.decode(req.session.token);

    // Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Exportação do extrato geral das contas", 10, 10);

    // Conteudo
    var linhaInicial = 50;
    var linhaAtual = linhaInicial;
    
    // Definir o cabeçalho da tabela
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ID", 10, linhaAtual);
    doc.text("Data", 30, linhaAtual);
    doc.text("Valor", 50, linhaAtual);
    doc.text("Categoria", 70, linhaAtual);
    doc.text("Descrição", 100, linhaAtual);
    linhaAtual += 10;

    // Definir o conteudo da tabela
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const response = await axios.get("http://localhost:3001/transacao/" + token.user);
    const data = response.data.transacao

    data.forEach(function(dados) {
        doc.text(dados.id.toString(), 10, linhaAtual);
        doc.text(dados.data_transacao, 30, linhaAtual);
        doc.text(dados.valor.toString(), 50, linhaAtual);
        doc.text(dados.categoria, 70, linhaAtual);
        doc.text(dados.descricao, 100, linhaAtual);
        linhaAtual += 10;
    });

    // Gera arquivo na base do projeto
    var dataAtual = new Date();
    var anoAtual = dataAtual.getFullYear();
    var mesAtual = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    var diaAtual = dataAtual.getDate().toString().padStart(2, '0');
    var dataFormatada = anoAtual + '-' + mesAtual + '-' + diaAtual;
    doc.save(`${dataFormatada}.pdf`);

    res.send('<script>alert("Exportação concluida com sucesso!"); window.location.href = "/";</script>');
};

// contato
export const postGerarCarga = async (req, res) => {
    const Usuario = require('../../models/usuario');
    const Transacao = require('../../models/transacao');
    const Conta = require('../../models/conta');
    const sequelize = require('../../db');
    await sequelize.sync()
    
    try{
        for (let i = 0; i < 5; i++) {              
            const nome = faker.name.findName();
            const email = faker.internet.email();
            const senha = faker.internet.password(8);
            const usuario = await Usuario.save(nome, email, senha)

            const nome_conta = faker.name.findName();
            const tipo_conta = faker.name.findName();
            const saldo = Math.floor(Math.random() * 101);
            const data_criacao = faker.date.between('1900-01-01', new Date()).toISOString().slice(0, 10);
            const conta = await Conta.save(nome_conta, tipo_conta, saldo, data_criacao, usuario.id)

            const data_transacao = faker.date.between('1900-01-01', new Date()).toISOString().slice(0, 10);
            const valor = Math.floor(Math.random() * 101);
            const categoria = faker.name.findName();
            const transacao = await Transacao.save(data_transacao, valor, categoria, conta.id)
        }
        res.send('<script>alert("Conteúdo prévio carregado com sucesso!"); window.location.href = "/";</script>');
    }
    catch (error){
        res.send('<script>alert("Não foi possível carregar conteúdo prévio."); window.location.href = "/";</script>');
    }
};

// grafico
export const getGrafico = async (req, res) => {
    const Conta = require('../../models/conta');
    const Transacao = require('../../models/transacao');
    const token = jwt.decode(req.session.token);

    const usuario = token.user

    const obj = await Conta.getByUsuario(usuario)

    let contas = []
    let lista = []
    obj.forEach(function(dados) {
        contas.push(dados.nome_conta)
        lista.push(dados.id)
    });

    const value = await Transacao.getByConta(lista)
    const somaValores = {};
    for (const item of value) {
        const { conta, valor } = item;
        if (somaValores[conta]) {
          somaValores[conta] += valor;
        } else {
          somaValores[conta] = valor;
        }
    }

    const transacao = Object.values(somaValores);

    res.render('grafico', {contas: contas, transacao: transacao})
};