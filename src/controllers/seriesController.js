const Series = require('../models/Series');
const cloudinary = require('../config/cloudinary');

exports.getAllSeries = async (req, res) => {
  try {
    const series = await Series.find();
    res.status(200).json({
      status: 'success',
      data: series
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.createSeries = async (req, res) => {
  try {
    const videoUrls = [];
    for (const file of req.files.serieVideos) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: 'video',
        folder: 'netflix-clone/series'
      });
      videoUrls.push(result.secure_url);
    }

    const coverResult = await cloudinary.uploader.upload(req.files.serieCover[0].path, {
      folder: 'netflix-clone/covers'
    });

    const trailerResult = await cloudinary.uploader.upload(req.files.serieTrailer[0].path, {
      resource_type: 'video',
      folder: 'netflix-clone/trailers'
    });

    const series = await Series.create({
      ...req.body,
      serieVideos: videoUrls,
      serieCover: coverResult.secure_url,
      serieTrailer: trailerResult.secure_url
    });

    res.status(201).json({
      status: 'success',
      data: series
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};