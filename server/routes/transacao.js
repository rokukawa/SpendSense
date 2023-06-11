import express from 'express';
import * as transacaoController from '../controllers/transacaoController';

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

router.get('/criar-transacao', verifyJWT, transacaoController.getCriarTransacao);

router.post('/criar-transacao', transacaoController.postCriarTransacao);

router.get('/listar-transacao', verifyJWT, transacaoController.getListarTransacao);

export default router;