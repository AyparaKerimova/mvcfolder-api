const List = require('../models/List');

exports.addToList = async (req, res) => {
  try {
    const { movieId, serieId } = req.body;
    const userId = req.user.id;
    
    if (!movieId && !serieId) {
      return res.status(400).json({ message: 'Provide either a movieId or serieId' });
    }
    
    const newItem = await List.create({ userId, movieId, serieId });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserList = async (req, res) => {
  try {
    const userId = req.user.id;
    const userList = await List.find({ userId }).populate('movieId serieId');
    res.status(200).json(userList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromList = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.id;
    
    const listItem = await List.findOne({ _id: id, userId });
    if (!listItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await List.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};