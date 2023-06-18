import express from 'express';
import * as usuarioController from '../controllers/usuarioController';

// função controle de acessos autenticado
const jwt = require("jsonwebtoken");

function verifyJWT (req, res, next){
    const token = req.session.token;
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if(err){
            return res.status(500).redirect('/login')
        }
        req.userId = decoded.user;
        next();
    })
}

const router = express.Router();

// API REST
router.get('/usuario/:id', usuarioController.getUsuario);
router.post('/usuario/criar', usuarioController.postUsuario);
router.put('/usuario/editar/:id/:nome/:email/:senha', usuarioController.putUsuario);
router.delete('/usuario/deletar/:id', usuarioController.deleteUsuario);
// router.get('/usuario/gerar', usuarioController.getCriarUsuario);


// API CLIENTE
router.get('/criar-usuario', usuarioController.getCriarUsuario);
router.post('/criar-usuario', usuarioController.postCriarUsuario);
router.get('/editar-usuario', verifyJWT, usuarioController.getEditarUsuario);
router.post('/listar-usuario', verifyJWT, usuarioController.postListarUsuario);

export default router;
