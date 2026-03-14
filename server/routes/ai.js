const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const aiLimit = require('../middleware/aiLimit');

// All AI routes require authentication
router.use(authMiddleware);

router.post('/generate', aiLimit, aiController.generateFromText);
router.post('/translate', aiLimit, aiController.translateToEnglish);
router.get('/health', aiController.healthCheck);

module.exports = router;
