const Message = require('../models/Message');
const User = require('../models/User');

const generateConversationId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}-${sortedIds[1]}`;
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        status: 'error',
        message: 'Receiver not found'
      });
    }

    if (req.user.role === 'user' && receiver.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Users can only send messages to admins'
      });
    }

    const conversationId = generateConversationId(senderId, receiverId);

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      conversationId
    });

    await message.populate('sender receiver', 'fullName nickname role');

    res.status(201).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (!userId || !currentUserId) {
      return res.status(400).json({
        status: 'error',
        message: 'User IDs are required.',
      });
    }

    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found.',
      });
    }

    if (req.user.role === 'user' && otherUser.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Users can only view conversations with admins.',
      });
    }

    const generateConversationId = (userId1, userId2) => {
      return [userId1, userId2].sort().join('_');
    };
    const conversationId = generateConversationId(currentUserId, userId);

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }) 
      .populate('sender receiver', 'fullName nickname role'); 

    res.status(200).json({
      status: 'success',
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID.',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  }
};

exports.getAllConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .sort({ createdAt: -1 })
    .populate('sender receiver', 'fullName nickname role');

    const conversations = messages.reduce((acc, message) => {
      const otherId = message.sender._id.equals(userId) 
        ? message.receiver._id 
        : message.sender._id;
      
      if (req.user.role === 'user') {
        const otherUser = message.sender._id.equals(userId) 
          ? message.receiver 
          : message.sender;
        if (otherUser.role !== 'admin') {
          return acc;
        }
      }

      if (!acc[otherId]) {
        acc[otherId] = {
          user: message.sender._id.equals(userId) ? message.receiver : message.sender,
          lastMessage: message,
          unreadCount: message.receiver._id.equals(userId) && !message.isRead ? 1 : 0
        };
      } else if (!message.isRead && message.receiver._id.equals(userId)) {
        acc[otherId].unreadCount++;
      }
      
      return acc;
    }, {});

    res.status(200).json({
      status: 'success',
      data: Object.values(conversations)
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    if (!message.receiver.equals(req.user._id)) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to perform this action'
      });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      status: 'success',
      data: message
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};