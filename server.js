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

// Your existing /book-service route stays here...

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
