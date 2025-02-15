const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/send', messageController.sendMessage);
router.get('/conversations', messageController.getAllConversations);
router.get('/conversation/:userId', messageController.getConversation);
router.patch('/read/:messageId', messageController.markAsRead);

module.exports = router;