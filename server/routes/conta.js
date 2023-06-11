import express from 'express';
import * as contaController from '../controllers/contaController';

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

router.get('/criar-conta', verifyJWT, contaController.getCriarConta);

router.post('/criar-conta', contaController.postCriarConta);


export default router;
