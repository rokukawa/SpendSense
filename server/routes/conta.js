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

// API REST
router.get('/conta', verifyJWT, contaController.getConta);
router.post('/conta/criar', verifyJWT, contaController.postConta);
router.put('/conta/editar', verifyJWT, contaController.putConta);
router.delete('/conta/deletar', verifyJWT, contaController.deleteConta);
// router.get('/conta/gerar', verifyJWT, contaController.getCriarConta);

// API CLIENTE
router.get('/criar-conta', verifyJWT, contaController.getCriarConta);
router.post('/criar-conta', contaController.postCriarConta);

export default router;
