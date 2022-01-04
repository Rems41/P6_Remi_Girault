const passwordValidator = require('password-validator');

const Schema = new passwordValidator();

//Modèle mot de passe attendu

Schema
.is().min(10)//Minimum 10 caractères                                   
.is().max(64)//Maximum 64 caractères                                 
.has().uppercase()//Doit contenir au moins une majuscule                              
.has().lowercase()//Doit contenir au moins une minuscule                             
.has().digits(2)//Doit contenir au moins 2 chiffres                              
.has().not().spaces()//Ne doit pas contenir d'espace
.oneOf(["Passw0rd", "Password123"]);//Mot de passe black listé                    

module.exports = Schema;