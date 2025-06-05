const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');

//@desc GET all users
//@route GET /api/users
//@access Public
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await userModel.find({});
  res.status(200).json(users);
});

//@desc GET a user by id
//@route GET /api/users/:id
//@access Public
const getUserById = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if(!user) {
        res.status(404);
        throw new Error('User not found');
    }
  res.status(200).json(user);
});

//@desc POST a new user
//@route POST /api/users
//@access Public
// registerUser can also be used to create a new user
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }
    const newUser = await userModel.create({ name, email, password });
    res.status(201).json(newUser);
    console.log(req.body);
});

//@desc PUT update a user by id
//@route PUT /api/users/:id
//@access Public
const updateUserById = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if(!user) {
        res.status(404);
        throw new Error('User not found');
    }
    const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedUser);
});

//@desc DELETE delete a user by id
//@route DELETE /api/users/:id
//@access Public
const deleteUserById = asyncHandler(async (req, res) => {
        const user = await userModel.findById(req.params.id);
    if(!user) {
        res.status(404);
        throw new Error('User not found');
    }
    await userModel.findByIdAndDelete(req.params.id);
  res.status(200).json(user);
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};