/////////////////////////Importation des modules/////////////////////////////////
//Plugins
const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const path = require("path");
const helmet = require('helmet');

//Connexion au fichier d'environnement
require('dotenv').config();

//Les Routes
const userRoutes = require("./routes/users");
const sauceRoutes = require('./routes/sauces');

// j'initialise Express
const app = express();

//J'utilise Mongosanitize pour prévenir les attaques par injection SQL
//Ici je choisi de remplacer les caractères jugés illicites par des underscores
app.use(mongoSanitize({
  replaceWith: "_",
  }),
);

//Connexion à la Database
const uri = "mongodb+srv://Rems:Pouyoute%4034@cluster0.gfouw.mongodb.net/project6?retryWrites=true&w=majority";
mongoose.connect(uri,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !', e));


//Helmet aide à protéger l'application de certaines des vulnérabilités comme les attaques XSS, en configurant de manière appropriée des en-têtes HTTP.
  app.use(helmet());

// Mise en place des en-têtes CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use(express.json());


//Enregistrement des routes
app.use("/images", express.static(path.join(__dirname, 'images'))); //Pour chaque requête envoyé à images on sert ce dossier statique images
app.use("/api/auth", userRoutes);
app.use('/api/sauces', sauceRoutes);

//On exporte notre fichier app
module.exports = app;