const express = require('express');
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', movieController.getAllMovies);
router.post(
  '/',
  authMiddleware.restrictTo('admin'),
  upload.fields([
    { name: 'movieVideo', maxCount: 1 },
    { name: 'movieCover', maxCount: 1 },
    { name: 'movieTrailer', maxCount: 1 }
  ]),
  movieController.createMovie
);

module.exports = router;