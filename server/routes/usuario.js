import express from 'express';
import * as usuarioController from '../controllers/usuarioController';

// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

function verifyJWT (req, res, next){
    const token = req.session.token;
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err){
            return res.status(500).redirect('login')
        }
        req.userId = decoded.user;
        next();
    })
}

const router = express.Router();

router.get('/criar-usuario', usuarioController.getCriarUsuario);

router.post('/criar-usuario',  usuarioController.postCriarUsuario);

router.get('/editar-usuario', verifyJWT, usuarioController.getEditarUsuario);

router.post('/editar-usuario',  usuarioController.postEditarUsuario);

export default router;
