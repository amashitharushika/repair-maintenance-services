const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

const users = []; // In-memory user storage

// Registration Route
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }
    users.push({ name, email, password });
    res.json({ success: true, message: 'Registration successful! Please login.' });
});

// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});


// --- NEW PROFILE ROUTES ---

// GET /profile - Fetch user details
app.get('/profile', (req, res) => {
    const { email } = req.query;
    const user = users.find(u => u.email === email);
    
    if (user) {
        // Return user info (exclude password!)
        res.json({ 
            success: true, 
            name: user.name, 
            email: user.email,
            avatar: user.avatar || null 
        });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// POST /profile/update - Update user details
app.post('/profile/update', (req, res) => {
    const { email, name, newPassword } = req.body;
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex !== -1) {
        // Update fields
        users[userIndex].name = name || users[userIndex].name;
        
        // Optional: Handle password update if you add that field later
        if (newPassword) {
            users[userIndex].password = newPassword;
        }

        console.log('User updated:', users[userIndex]); // Debug log
        
        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: { 
                name: users[userIndex].name, 
                email: users[userIndex].email 
            }
        });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// Mock Booking Route (Placeholder)
app.post('/api/bookings', (req, res) => {
    console.log('Booking received:', req.body);
    res.json({ success: true, message: 'Booking received' });
});


// Your existing /book-service route stays here...

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
