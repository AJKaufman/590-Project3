// // using code from DomoMaker E
// const models = require('../models');
//
// const Game = models.Game;
//
// const gamePage = (req, res) => {
//  Game.GameModel.findByOwner(req.session.account._id, (err, docs) => {
//    if (err) {
//      console.log(err);
//      return res.status(400).json({ error: 'An error occurred' });
//    }
//
//    return res.render('index', { csrfToken: req.csrfToken() });
//  });
// };
//
//module.exports.gamePage = gamePage;