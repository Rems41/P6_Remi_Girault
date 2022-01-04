const bcrypt = require('bcrypt'); //Permet de crypter le mot de passe
const jwt = require('jsonwebtoken'); //Permet de créer et vérifier les tokens d'authentification
const emailValidator = require("email-validator"); //Permet d'avoir un email valide

require('dotenv').config();

const schema = require("../models/password");

const User = require('../models/user');


//Inscription de l'utilisateur
exports.signup = (req, res, next) => {
    
    if (!emailValidator.validate(req.body.email)){//si l'email n'est pas valide alors
        return res.status(401).json({message: 'Veuillez entrer une adresse email valide'});
    }

    if (!schema.validate(req.body.password)){ //Si le password n'est pas valide  au schema
        return res.status(401).json({message: 'Le MDP doit faire 10 caractère au moins, avec une maj, une min et deux chiffres au moins.'});
    };

    
    return bcrypt.hash(req.body.password, 10) //Permet de hash le password avec un salage de 10 tours
        .then(hash =>{
            const user = new User({ //Créé un nouvel utilisateur
                email: req.body.email,
                password: hash
            });
            
            return user.save() //Sauvegarde dans la base de données
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}))
            ;
            
        })
        .catch(error => res.status(500).json({error}))
    ;
}

//Connexion à un compte utilisateur
exports.login = (req, res, next) => {
    if(!req || !req.body || !req.body.email)
        throw new Error('No email provided.');
    return User.findOne({email: req.body.email}) //Recherche l'email utilisateur dans la base de données
        .then(user => {
            if(!user){ //S'il n'existe pas alors
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            return bcrypt.compare(req.body.password, user.password) //Compare le password utilisateur avec celui enregistré dans la base de données
                .then(valid => { 
                    if(!valid){ //Si différent alors
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    let token = jwt.sign(
                        {userId: user._id}, //Données encodés
                        process.env.TOKEN, //Clé secrete
                        {expiresIn: '24h'} //Durée d'expiration du token
                    );
                    return res.status(200).json({ //Sinon on renvoie cet objet
                        userId: user._id,
                        token: token
                    }); 
                })
                .catch(error => res.status(500).json({error}))
            ;
        })
        .catch(error => res.status(500).json({error}))
    ;
};