const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaffById,
  deleteStaffById,
} = require('../controllers/staffController');

router.route('/')
  .get(getAllStaff)
  .post(createStaff);

router.route('/:id')
  .get(getStaffById)
  .put(updateStaffById)
  .delete(deleteStaffById);

module.exports = router;
