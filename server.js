const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// FIX 1: Increase body size limit to allow image uploads (Base64)
app.use(express.json({ limit: '10mb' })); 
app.use(express.static(path.join(__dirname, 'src')));

// In-memory user storage
const users = []; 

// Registration
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    // Initialize with no avatar
    users.push({ name, email, password, avatar: null });
    res.json({ success: true, message: 'Registration successful! Please login.' });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

// GET Profile
app.get('/profile', (req, res) => {
    const { email } = req.query;
    const user = users.find(u => u.email === email);
    
    if (user) {
        res.json({ 
            success: true, 
            name: user.name, 
            email: user.email,
            avatar: user.avatar // Send avatar back to frontend
        });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// POST Profile Update
app.post('/profile/update', (req, res) => {
    const { email, name, avatar } = req.body; // FIX 2: Accept 'avatar'
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex !== -1) {
        // Update name
        if (name) users[userIndex].name = name;
        
        // Update avatar if provided
        if (avatar) users[userIndex].avatar = avatar;

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: { 
                name: users[userIndex].name, 
                email: users[userIndex].email,
                avatar: users[userIndex].avatar
            }
        });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



































