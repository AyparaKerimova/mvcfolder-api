const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required']
  },
  description: {
    type: String,
    required: [true, 'Movie description is required']
  },
  genre: [{
    type: String,
    required: [true, 'At least one genre is required']
  }],
  cast: [{
    type: String,
    required: [true, 'Cast members are required']
  }],
  imdbScore: {
    type: Number,
    required: [true, 'IMDB score is required'],
    min: 0,
    max: 10
  },
  movieVideo: {
    type: String,
    required: [true, 'Movie video is required']
  },
  movieCover: {
    type: String,
    required: [true, 'Movie cover is required']
  },
  movieTrailer: {
    type: String,
    required: [true, 'Movie trailer is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);