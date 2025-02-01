const Movie = require('../models/Movie');
const cloudinary = require('../config/cloudinary');

exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      status: 'success',
      data: movies
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const videoResult = await cloudinary.uploader.upload(req.files.movieVideo[0].path, {
      resource_type: 'video',
      folder: 'netflix-clone/movies'
    });

    const coverResult = await cloudinary.uploader.upload(req.files.movieCover[0].path, {
      folder: 'netflix-clone/covers'
    });

    const trailerResult = await cloudinary.uploader.upload(req.files.movieTrailer[0].path, {
      resource_type: 'video',
      folder: 'netflix-clone/trailers'
    });

    const movie = await Movie.create({
      ...req.body,
      movieVideo: videoResult.secure_url,
      movieCover: coverResult.secure_url,
      movieTrailer: trailerResult.secure_url
    });

    res.status(201).json({
      status: 'success',
      data: movie
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};