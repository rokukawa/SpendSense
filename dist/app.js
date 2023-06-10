"use strict";

var _express = _interopRequireDefault(require("express"));
var _compression = _interopRequireDefault(require("compression"));
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _cors = _interopRequireDefault(require("cors"));
var _helmet = _interopRequireDefault(require("helmet"));
var _morgan = _interopRequireDefault(require("morgan"));
var routes = _interopRequireWildcard(require("./routes"));
var _expressHandlebars = require("express-handlebars");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable no-console */

const app = (0, _express.default)();
const session = require("express-session");
app.use(session({
  secret: process && process.env && process.env.SECRET || "web2",
  resave: false,
  saveUninitialized: false
}));
app.use((0, _morgan.default)('dev'));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _cookieParser.default)());
app.use((0, _helmet.default)());
app.use((0, _cors.default)());
app.use((0, _compression.default)());

// dotenv
require('dotenv').config();

// rotas
app.use('/', routes.home);
app.use('/', routes.usuario);

// templates
const path = require('path');
app.engine('.hbs', (0, _expressHandlebars.engine)({
  extname: '.hbs',
  default: false,
  layoutDir: path.join(__dirname, "views")
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));
app.use(_express.default.static("static"));
module.exports = app;