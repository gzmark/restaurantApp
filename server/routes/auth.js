const express = require('express');
const router = express.Router();
const {
    loginUser,
    registerUser,
    getCurrentUser,
    logoutUser,
} = require('../controllers/authController');
const validateToken = require('../middleware/validateTokenHandler');

router.post('/login',loginUser);

router.post('/register',registerUser);

router.get('/currentUser',validateToken,getCurrentUser);

router.post('/logout',logoutUser);

module.exports = router;