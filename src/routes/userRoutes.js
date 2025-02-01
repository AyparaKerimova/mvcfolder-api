const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', authMiddleware.restrictTo('admin'), userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch(
  '/update-profile',
  upload.single('profileImage'),
  userController.updateProfile
);

module.exports = router;