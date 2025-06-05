const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
} = require('../controllers/userController');

router.route('/').post(createUser);

router.route('/').get(getAllUsers);

router.route('/:id').get(getUserById);

router.route('/:id').put(updateUserById);

router.route('/:id').delete(deleteUserById);


module.exports = router;