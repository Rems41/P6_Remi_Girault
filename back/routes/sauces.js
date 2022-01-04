//on appel les plugins
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

//Appel des fichiers
const sauceCtrl = require('../controllers/sauces');

//Création des routes et appel des fonctions
router.post('/', auth, multer, sauceCtrl.createSauce);//Enregistre une sauce dans la base de données
router.post('/:id/like', auth, sauceCtrl.likeSauce);//Enregistre les likes, dislikes et annulation.
router.get('/:id', auth, sauceCtrl.getOneSauce);// Récupération d'une sauce spécifique
router.get('/', auth, multer, sauceCtrl.getAllSauces);// Renvoie toutes les sauces
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Mettre à jour une sauce existante 
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce); // Supprimer une sauce


module.exports = router;