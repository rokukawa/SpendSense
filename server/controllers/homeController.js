// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

// função para envio de email
const nodemailer = require("nodemailer");

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

const transporter = nodemailer.createTransport({
    host: process.env.NDM_HOST,
    port: process.env.NDM_PORT,
    secure: false, 
    auth: {
        user: process.env.NDM_USER,
        pass: process.env.NDM_PASS
    }
})

export const postContato = async (req, res) => {
    const {name, email, subject, message} = req.body

    await transporter.verify((er, suc) => {
        if (er) {
            console.error('Erro ao verificar conexão:', er);
            console.log(process.env)
        } else {
            console.log('Conexão verificada com sucesso');
        }
    })

    await transporter.sendMail({
        text: message,
        subject: subject,
        from: `${name} <${email}>}`,
        to: process.env.NDM_USER
    })
    .then((response) => {
        res.redirect('/')
    })
    .catch((error) => {
        res.redirect('/')
    })

};
