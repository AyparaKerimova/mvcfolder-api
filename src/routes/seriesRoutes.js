const express = require('express');
const seriesController = require('../controllers/seriesController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', seriesController.getAllSeries);
router.post(
  '/',
  authMiddleware.restrictTo('admin'),
  upload.fields([
    { name: 'serieVideos', maxCount: 50 },
    { name: 'serieCover', maxCount: 1 },
    { name: 'serieTrailer', maxCount: 1 }
  ]),
  seriesController.createSeries
);

module.exports = router;