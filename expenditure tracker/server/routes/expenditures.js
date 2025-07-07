const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditureController');
const auth = require('../middleware/auth');

router.get('/', auth, expenditureController.getAll);
router.post('/', auth, expenditureController.create);
router.delete('/:id', auth, expenditureController.remove);
router.put('/:id', auth, expenditureController.update);

module.exports = router;
