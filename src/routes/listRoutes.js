const express = require('express');
const listController = require('../controllers/listController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware.protect);
router.post('/add', listController.addToList);
router.get('/', listController.getUserList);
router.delete('/:id', listController.removeFromList);

module.exports = router;