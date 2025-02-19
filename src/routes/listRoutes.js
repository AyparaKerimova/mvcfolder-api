const express = require("express");
const listController = require("../controllers/listController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/add", listController.addToList);
router.get("/:userId", listController.getUserList);
router.get("/:id", listController.getListItemById); 
router.delete("/remove/:id", listController.removeFromList);

module.exports = router;
