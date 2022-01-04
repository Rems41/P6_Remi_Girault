//appel du pluggin jwt
const jwt = require('jsonwebtoken');

// Middleware d'authentification
module.exports = (req, res, next) => {
    try{
        console.log('process.env.TOKEN', process.env.TOKEN);
        const token = req.headers.authorization.split(' ')[1]; //Récupère seulement le token du header authorization de la requête
        console.log('auth', token);
        const decodedToken = jwt.verify(token, process.env.TOKEN); //Decode le token en vérifiant le token avec celui présent dans la fonction login
        const userId = decodedToken.userId; //Récupère le userId
        if (req.body.userId && req.body.userId !== userId) { //Vérifie s'il y a un userId dans la requête et que celui ci est différent de l'user Id alors
            throw new Error('403:unauthorized request'); //Renvoie l'erreur
        }else{
            console.log('next')
            next();
        }
    }catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée'});
    }
};