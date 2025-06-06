const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const staffModel = require('../models/staffModel');

//@desc POST login
//@route POST /api/auth/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {        
        res.status(400);
        throw new Error('Missing required fields');
    }
    const user = await userModel.findOne({ email });
    if(user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {
                user: {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET
                //, { expiresIn: '1h' }
                , { expiresIn: '10m' }
            );
            res.status(200).json({ token, message: 'Hello World!, from the login user!' });
        }
        else {
            res.status(401);
            throw new Error('Invalid password or user not found');
        }
});


  const loginStaff = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Missing required fields");
    }
    const staff = await staffModel.findOne({ email });
    if (staff && (await bcrypt.compare(password, staff.password))) {
      const token = jwt.sign(
        {
          staff: {
            name: staff.name,
            email: staff.email,
            id: staff.id,
            role: staff.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token, role: staff.role });
    } else {
      res.status(401);
      throw new Error("Invalid password or staff not found");
    }
  });

// const loginStaff = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   const staff = await staffModel.findOne({ email });

//   if (!staff) {
//     return res.status(401).json({ message: 'Staff not found' });
//   }

//   const isMatch = await bcrypt.compare(password, staff.password);

//   if (!isMatch) {
//     return res.status(401).json({ message: 'Invalid password' });
//   }

//   res.status(200).json({ role: staff.role });
// });


// const loginStaff = asyncHandler(async (req, res) => {
//   const { email } = req.body;

//   // Skip all checks — return a fake token for any email input
//   const token = jwt.sign(
//     {
//       user: {
//         name: 'Test User',
//         email: email || 'test@example.com',
//         id: 'test-id',
//         role: 'mesero',
//       },
//     },
//     process.env.ACCESS_TOKEN_SECRET || 'testsecret', // fallback secret for testing
//     { expiresIn: '1h' }
//   );

//   res.status(200).json({ token, role: 'admin' });
// });


//@desc POST register
//@route POST /api/auth/register
//@access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        res.status(400);
        throw new Error('All fields are required');
    }
    const existingUser  = await userModel.findOne({ email });
    if(existingUser) {
        res.status(400).json({ message: 'Email already exists' });
        throw new Error('Email already exists');
    }
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // change to 10 if salt is not generated
    console.log("hashedPassword: ", hashedPassword);
    const newUser = await userModel.create({ name, email, password: hashedPassword });
    console.log(`New user created: ${newUser}`);
    if(newUser) {
        res.status(201).json({_id: newUser.id, name: newUser.name, email: newUser.email});
    }

    else {
        res.status(400);
        throw new Error('Error creating user');
    }
    res.json({ message: 'Creating a new user!' });
    console.log(req.body);
});

//@desc GET currentUser or POST currentUser?
//@route GET /api/auth/currentUser or POST /api/auth/currentUser?
//@access Private
const getCurrentUser = asyncHandler(async (req, res) => {
    res.json({ message: 'Current user: ', user: req.user });
});

//@desc GET logout or POST logout?
//@route GET /api/auth/logout or POST /api/auth/logout?
//@access Public
const logoutUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: 'user logged out' });
});

module.exports = {
    loginUser,
    registerUser,
    getCurrentUser,
    logoutUser,
    loginStaff,
};