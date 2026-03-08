const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// All AI routes require authentication
router.use(authMiddleware);

router.post('/generate', aiController.generateFromText);
router.post('/translate', aiController.translateToEnglish);
router.get('/health', aiController.healthCheck);

module.exports = router;
