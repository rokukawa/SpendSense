/* eslint-disable no-console */
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import * as routes from './routes';
import { engine } from 'express-handlebars';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());

// rotas
app.use('/', routes.home);

//templates
const path = require('path');
app.engine('.hbs', engine({
    extname: '.hbs',
    default: false,
    layoutDir: path.join(__dirname, "views")
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static("static"));

module.exports = app;
