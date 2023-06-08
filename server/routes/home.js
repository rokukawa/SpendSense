import express from 'express';
import * as homeController from '../controllers/homeController';

const router = express.Router();

router.get('/login', homeController.getLogin);

router.get('/', homeController.getHome);

router.get('/sobre', homeController.getSobre);

router.get('/ferramentas-tecnologias', homeController.getFerramentasTecnologias);

router.get('/portfolio', homeController.getPortfolio);

router.get('/contato', homeController.getContato);

export default router;
