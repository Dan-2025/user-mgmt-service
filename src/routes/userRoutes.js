const express = require('express');
const { registerUser, loginUser, getUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:username', getUser);
router.put('/:username', updateUser);
router.delete('/:username', deleteUser);

module.exports = router;