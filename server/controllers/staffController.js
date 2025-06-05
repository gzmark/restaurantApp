const asyncHandler = require('express-async-handler');
const Staff = require('../models/staffModel');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Public
const getAllStaff = asyncHandler(async (req, res) => {
  const staffList = await Staff.find({});
  res.status(200).json(staffList);
});

// @desc    Get a staff by ID
// @route   GET /api/staff/:id
// @access  Public
const getStaffById = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }
  res.status(200).json(staff);
});

// @desc    Create a new staff
// @route   POST /api/staff
// @access  Public
const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, role, telefono, fechaNacimiento, mesasAsignadas, turno } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Name, email, password, and role are required');
  }

  const newStaff = await Staff.create({
    name,
    email,
    password,
    role,
    telefono,
    fechaNacimiento,
    mesasAsignadas,
    turno,
  });

  res.status(201).json(newStaff);
});

// @desc    Update a staff by ID
// @route   PUT /api/staff/:id
// @access  Public
const updateStaffById = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedStaff);
});

// @desc    Delete a staff by ID
// @route   DELETE /api/staff/:id
// @access  Public
const deleteStaffById = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  await Staff.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Staff member deleted', staff });
});

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaffById,
  deleteStaffById,
};
