const express = require('express');
const router = express.Router();
const cvController = require('../controllers/cvController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', cvController.saveCV);
router.get('/', cvController.getCVs);
router.delete('/:id', cvController.deleteCV);

module.exports = router;
