// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
const axios = require('axios');

// função para envio de email
const nodemailer = require("nodemailer");

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
