"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var homeController = _interopRequireWildcard(require("../controllers/homeController"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// função controle de acessos autenticado
const jwt = require("jsonwebtoken");
function verifyJWT(req, res, next) {
  const token = req.session.token;
  jwt.verify(token, process && process.env && process.env.SECRET || "web2", (err, decoded) => {
    if (err) {
      return res.status(500).redirect('login');
    }
    req.userId = decoded.user;
    next();
  });
}
const router = _express.default.Router();
router.get('/login', homeController.getLogin);
router.post('/login', homeController.postLogin);
router.post('/logout', homeController.postLogout);
router.get('/', verifyJWT, homeController.getHome);
router.get('/sobre', verifyJWT, homeController.getSobre);
router.get('/ferramentas-tecnologias', verifyJWT, homeController.getFerramentasTecnologias);
router.get('/portfolio', verifyJWT, homeController.getPortfolio);
router.get('/contato', verifyJWT, homeController.getContato);
var _default = router;
exports.default = _default;