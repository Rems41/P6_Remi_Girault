const mongoose = require('mongoose');


// Creation schema de donnée 
// Modèle de données qui permet d'enregistrer, lire et modifier les objets qui sont dans la base de donnée
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },//l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
  name: { type: String, required: true },//nom de la sauce
  manufacturer: { type: String, required: true },//fabricant de la sauce
  description: { type: String, required: true },//courte description de la sauce
  mainPepper: { type: String, required: true },//Principaux ingrédients de la sauce
  imageUrl: { type: String, required: true },//image de la sauce
  heat: { type: Number, required: true },//Intensité de la sauce noté de 1 à 10
  likes: { type: Number, required: false },//nombre d'utilisateurs qui aiment la sauce
  dislikes: { type: Number, required: false },//nombre d'utilisateurs qui n'aiments pas la sauce
  usersLiked: { type: Array, required: false },//tableau des identifiants des utilisateurs qui ont aimé la sauce
  usersDisliked: { type: Array, required: false },//tableau des identifiants des utilisateurs qui n'ont pas aimé la sauce
});

module.exports = mongoose.model('Sauce', sauceSchema);