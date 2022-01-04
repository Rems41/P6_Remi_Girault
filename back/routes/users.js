///////////CRÉATION ROUTERS/////////////
//IMPORTER EXPRESS
const express = require('express');

//CRÉER ROUTER (MÉTHODE ROUTER D'EXPRESS)
const router = express.Router();

//j'importe mon controlleur user
const userCtrl = require('../controllers/users');

//Limitation du nombre et de la durée de connexion
const limit = require('../middleware/limitconnexion');

//CRÉER ROUTES POST USER
router.post('/signup', userCtrl.signup);
router.post('/login', limit.max, userCtrl.login);

//EXPORTER ROUTER
module.exports = router;