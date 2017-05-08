// using code from DomoMaker E by Aidan Kaufman
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let GameModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const GameSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

GameSchema.statics.toAPI = (doc) => ({
  _id: doc._id,
});

GameModel = mongoose.model('Game', GameSchema);

module.exports.GameModel = GameModel;
module.exports.GameSchema = GameSchema;

