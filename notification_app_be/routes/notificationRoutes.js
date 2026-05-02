const express = require('express');
const router = express.Router();

const controller = require('../controllers/notificationController');

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.patch('/:id', controller.markRead);

// ✅ This now works because controller.delete exists
router.delete('/:id', controller.delete);

module.exports = router;