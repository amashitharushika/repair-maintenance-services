const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for bookings
const bookings = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// Validation helper function
function validateBooking(data) {
    const errors = [];
    
    if (!data.name || data.name.trim() === '') {
        errors.push('Name is required');
    }
    
    if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Invalid email format');
        }
    }
    
    if (!data.service || data.service.trim() === '') {
        errors.push('Service is required');
    }
    
    if (!data.date || data.date.trim() === '') {
        errors.push('Date is required');
    }
    
    return errors;
}

// POST /book-service endpoint
app.post('/book-service', (req, res) => {
    try {
        const { name, email, service, date, additionalNotes } = req.body;
        
        // Validate all required fields
        const validationErrors = validateBooking(req.body);
        
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }
        
        // Create booking object
        const booking = {
            id: bookings.length + 1,
            name: name.trim(),
            email: email.trim(),
            service: service,
            date: date,
            additionalNotes: additionalNotes || '',
            createdAt: new Date().toISOString()
        };
        
        // Save booking in-memory
        bookings.push(booking);
        
        // Respond with success
        res.json({
            success: true,
            message: 'Booking received'
        });
        
    } catch (error) {
        console.error('Error processing booking:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Optional: GET endpoint to view all bookings (for testing)
app.get('/bookings', (req, res) => {
    res.json({
        success: true,
        count: bookings.length,
        bookings: bookings
    });
});

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Bookings endpoint: POST http://localhost:${PORT}/book-service`);
});
