// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');





require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://okoasemfrontend.onrender.com'
}));
// app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Failed:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    unique: true },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  profileImage: { type: String, default: '' },
  password: { type: String, 
  required: true },
  
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  course: { type: String, required: true }, // New field for course
  year: { type: String, required: true }, 
  uploadedBy: String, // 'admin'
  dateUploaded: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});


// Model
const User = mongoose.model('User', userSchema);
const File = mongoose.model('File', fileSchema);
const Message = mongoose.model('Massage', messageSchema);


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Verify Token Middleware
// Verify Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    // Find user by username from the decoded token
    const user = await User.findOne({ username: decoded.username }); 

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user; // Attach user to the request object
    next(); // Move to the next middleware or route
  } catch (err) {
    console.error('Authentication failed:', err);
    res.status(403).json({ message: 'Invalid token.' });
  }
};
// Register Route
app.post('/api/register', async (req, res) => {
  const { username, email, password, role, secretKey } = req.body;

  // Check for admin role and validate secret key
  if (role === 'admin' && secretKey !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ message: 'Invalid secret key for admin registration.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username,email, password: hashedPassword, role });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {

    res.status(500).json({ message: 'Error registering user.' });
  }
});

// contact
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newMessage = new Message({
      name,
      email,
      phone,
      message
    });

    await newMessage.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
});


app.get('/api/contact-messages', async (req, res) => {
  try {
    const messages = await Message.find();  // Assuming MessageModel is your Mongoose model for messages
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Server error');
  }
});
  

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Create JWT token
  const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

// Protected Route - Get User Info
app.get('/api/dashboard', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, SECRET);
      res.json({
        username: decoded.username,
        role: decoded.role,
        message: `Welcome, ${decoded.username}!`,
      });
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  });

  // Route: Admin uploads files
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    const {  fileName, year, course } = req.body;  // Extract fileName from the request body
  
    try {
      const newFile = new File({
        filename: req.file.filename,        // Saved file's name on the server
        year: year,
        course: course,
        originalName: fileName || req.file.originalname,  // Use provided file name or fallback to original name
        uploadedBy: 'admin',
      });
      await newFile.save();
      res.status(201).json({ message: 'File uploaded successfully!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'File upload failed.' });
    }
  });
  
  

// Route: Users fetch available files
app.get('/api/files', async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch files.' });
  }
});

// Upload profile image route

app.post(
  '/api/upload-profile-image',
  verifyToken, // Ensure this middleware runs before accessing the route
  upload.single('profileImage'),
  async (req, res) => {
    try {


      const userId = req.user._id; // Access user ID from authenticated request
      const imageUrl = `/uploads/${req.file.filename}`;

      if (userId.profileImage) {
        const oldImagePath = path.join(__dirname, 'uploads', userId.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image
        }
      }

      await User.findByIdAndUpdate(userId, { profileImage: imageUrl });
      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error during upload.' });
    }
  }
);

app.get('/api/user', verifyToken, async (req, res) => {
  try {
    const user = req.user; // Ensure req.user is set by the middleware

    // Check if user has a profileImage and construct the full URL
    const profileImageUrl = user.profileImage 
      ? `http://localhost:5000${user.profileImage}` // Adjust the path if needed
      : 'http://localhost:5000/uploads/1729505277232-azure.png'; // Default placeholder image

    res.json({
      username: user.username,
      profileImage: profileImageUrl,
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


  
// Protected route

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
