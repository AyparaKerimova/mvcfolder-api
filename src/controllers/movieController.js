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
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }

    res.status(200).json({
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
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }

    const extractPublicId = (url) => {
      const parts = url.split('/');
      return parts[parts.length - 1].split('.')[0];
    };

    await cloudinary.uploader.destroy(extractPublicId(movie.movieCover)); 
    await cloudinary.uploader.destroy(extractPublicId(movie.movieVideo), { resource_type: 'video' }); 
    await cloudinary.uploader.destroy(extractPublicId(movie.movieTrailer), { resource_type: 'video' }); 

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};