import express from 'express';
import * as homeController from '../controllers/homeController';

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

router.get('/login', homeController.getLogin);

router.post('/login', homeController.postLogin);

router.post('/logout', homeController.postLogout);

router.get('/', verifyJWT, homeController.getHome);

router.get('/sobre', verifyJWT, homeController.getSobre);

router.get('/ferramentas-tecnologias', verifyJWT, homeController.getFerramentasTecnologias);

router.get('/portfolio', verifyJWT, homeController.getPortfolio);

router.get('/contato', verifyJWT, homeController.getContato);

export default router;
