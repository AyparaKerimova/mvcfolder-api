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
exports.getSeriesById = async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json({
        status: 'fail',
        message: 'Series not found'
      });
    }

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
exports.deleteSeries = async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) {
      return res.status(404).json({
        status: 'fail',
        message: 'Series not found'
      });
    }

    const extractPublicId = (url) => {
      const parts = url.split('/');
      return parts[parts.length - 1].split('.')[0];
    };

    await cloudinary.uploader.destroy(extractPublicId(series.serieCover)); 
    await cloudinary.uploader.destroy(extractPublicId(series.serieTrailer), { resource_type: 'video' }); 

    for (const videoUrl of series.serieVideos) {
      await cloudinary.uploader.destroy(extractPublicId(videoUrl), { resource_type: 'video' });
    }

    await Series.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Series deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};