const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Series title is required']
  },
  description: {
    type: String,
    required: [true, 'Series description is required']
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
  serieVideos: [{
    type: String,
    required: [true, 'Series videos are required']
  }],
  serieCover: {
    type: String,
    required: [true, 'Series cover is required']
  },
  serieTrailer: {
    type: String,
    required: [true, 'Series trailer is required']
  },
  serieCount: {
    type: Number,
    required: [true, 'Series count is required']
  },
  seasonCount: {
    type: Number,
    required: [true, 'Season count is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Series', seriesSchema);