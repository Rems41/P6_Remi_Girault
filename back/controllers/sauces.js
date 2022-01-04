//----------------------- fichier contenant la logique appliquée à chaque route sauce -----------------------// 

// import du modele sauce
const Sauce = require('../models/sauces');

// import file system pour avoir accès aux differentes opérations liées au systeme de fichier (ex: supprimer un fichier)
const fs = require('fs');

// Création et enregistrement d'une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(req.file.filename);
    delete sauceObject._id;
    // Creation d'une nouvelle instance du modèle Sauce
    const sauce = new Sauce({
      ...sauceObject,
      // Génère url de l'image
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    sauce.save()// Enregistre dans la database l'objet et renvoie une promesse
      .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !'}))
      .catch(error =>  res.status(400).json({ message: error }));
      
};

// Selectionner une sauce existante de la database.
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id }) // Méthode pour trouver une sauce unique
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
};

// Renvoie toutes les sauces enregistrées dans la base de données
exports.getAllSauces = (req, res, next) => {
  Sauce.find() // Methode renvoie un tableau contenant toutes les sauces dans la base de données
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce), // Récupération de toutes les infos sur l'objet
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Supression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


//Choix de l'utilisateur : like, dislike ou annulation 
exports.likeSauce = (req, res) => {
  /*if(!req || !req.body || !req.body.userId || !req.body.like)
    throw new Error('No userId.');
  if(!req || !req.params || !req.params.id)
  throw new Error('No sauce.');*/
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
  
  switch (like) {
    case 1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
          .then(() => res.status(200).json({ message: `Sauce aimée !` }))
          .catch((error) => res.status(400).json({ error }))
            
      break;

    case 0 :
        Sauce.findOne({ _id: sauceId })
           .then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                .then(() => res.status(200).json({ message: `J'aime annulé` }))
                .catch((error) => res.status(400).json({ error }))
            }
            if (sauce.usersDisliked.includes(userId)) { 
              Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                .then(() => res.status(200).json({ message: `Je n'aime pas annulé` }))
                .catch((error) => res.status(400).json({ error }))
            }
          })
          .catch((error) => res.status(404).json({ error }))
      break;

    case -1 :
        Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
          .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })
          .catch((error) => res.status(400).json({ error }))
      break;
      
      default:
        console.log(error);
  }
}

