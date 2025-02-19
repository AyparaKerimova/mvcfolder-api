const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    default: null
  },
  serieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('List', listSchema);
