// Service data
const services = [
    {
        id: 1,
        name: 'Plumbing',
        description: 'Expert plumbing services for all your water and drainage needs. From leak repairs to complete installations.',
        icon: '🔧',
        features: [
            'Leak detection and repair',
            'Pipe installation',
            'Drain cleaning',
            'Water heater service'
        ]
    },
    {
        id: 2,
        name: 'Electrical',
        description: 'Safe and reliable electrical services. Licensed electricians for all your electrical needs.',
        icon: '⚡',
        features: [
            'Wiring and rewiring',
            'Panel upgrades',
            'Outlet installation',
            'Lighting solutions'
        ]
    },
    {
        id: 3,
        name: 'AC Repair',
        description: 'Keep your home cool with our professional air conditioning repair and maintenance services.',
        icon: '❄️',
        features: [
            'AC installation',
            'Maintenance & cleaning',
            'Refrigerant recharge',
            'Emergency repairs'
        ]
    },
    {
        id: 4,
        name: 'Carpentry',
        description: 'Quality carpentry work for custom furniture, repairs, and home improvements.',
        icon: '🪚',
        features: [
            'Custom furniture',
            'Cabinet installation',
            'Door & window repair',
            'Deck construction'
        ]
    }
];

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const bookServiceBtn = document.getElementById('bookServiceBtn');
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.querySelector('.close-modal');
const bookingForm = document.getElementById('bookingForm');
const servicesGrid = document.getElementById('servicesGrid');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeServices();
    initializeModal();
    initializeForm();
});

// Navigation toggle for mobile
function initializeNavigation() {
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Render services cards
function initializeServices() {
    if (servicesGrid) {
        servicesGrid.innerHTML = services.map(service => `
            <div class="service-card" data-service-id="${service.id}">
                <div class="service-icon">${service.icon}</div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <ul class="service-features">
                    ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        // Add click event to service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const serviceId = card.getAttribute('data-service-id');
                const service = services.find(s => s.id === parseInt(serviceId));
                if (service) {
                    openBookingModal(service.name.toLowerCase().replace(' ', '-'));
                }
            });
        });
    }
}

// Modal functionality
function initializeModal() {
    if (bookServiceBtn) {
        bookServiceBtn.addEventListener('click', () => {
            openBookingModal();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeBookingModal();
        });
    }

    // Close modal when clicking outside
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal.style.display === 'block') {
            closeBookingModal();
        }
    });
}

function openBookingModal(serviceType = '') {
    if (bookingModal) {
        bookingModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Pre-fill service type if provided
        if (serviceType && document.getElementById('serviceType')) {
            const serviceTypeMap = {
                'plumbing': 'plumbing',
                'electrical': 'electrical',
                'ac-repair': 'ac-repair',
                'carpentry': 'carpentry'
            };
            const mappedType = serviceTypeMap[serviceType] || serviceType;
            document.getElementById('serviceType').value = mappedType;
        }
    }
}

function closeBookingModal() {
    if (bookingModal) {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (bookingForm) {
            bookingForm.reset();
        }
    }
}

// Form submission
function initializeForm() {
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                serviceType: document.getElementById('serviceType').value,
                customerName: document.getElementById('customerName').value,
                customerEmail: document.getElementById('customerEmail').value,
                customerPhone: document.getElementById('customerPhone').value,
                serviceDate: document.getElementById('serviceDate').value,
                serviceDescription: document.getElementById('serviceDescription').value
            };

            // Show loading state
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            try {
                // Call API to submit booking
                const response = await submitBooking(formData);
                
                if (response.success) {
                    alert('Booking submitted successfully! We will contact you soon.');
                    closeBookingModal();
                } else {
                    alert('Error submitting booking. Please try again.');
                }
            } catch (error) {
                console.error('Booking submission error:', error);
                alert('An error occurred. Please try again later.');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
}

// API Functions - Placeholders for backend integration

/**
 * Submit booking to backend API
 * @param {Object} bookingData - The booking form data
 * @returns {Promise<Object>} API response
 */
async function submitBooking(bookingData) {
    // TODO: Replace with actual API endpoint
    const API_ENDPOINT = '/api/bookings';
    
    try {
        // Placeholder: Replace with actual fetch call
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // For development: simulate API call
        console.log('API call placeholder - Booking data:', bookingData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock success response
        return {
            success: true,
            message: 'Booking submitted successfully',
            bookingId: Math.floor(Math.random() * 10000)
        };
    }
}

/**
 * Fetch services from backend API
 * @returns {Promise<Array>} Array of services
 */
async function fetchServices() {
    // TODO: Replace with actual API endpoint
    const API_ENDPOINT = '/api/services';
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        // For development: return local services data
        console.log('API call placeholder - Using local services data');
        return services;
    }
}

/**
 * Fetch booking status from backend API
 * @param {string} bookingId - The booking ID
 * @returns {Promise<Object>} Booking status
 */
async function fetchBookingStatus(bookingId) {
    // TODO: Replace with actual API endpoint
    const API_ENDPOINT = `/api/bookings/${bookingId}`;
    
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching booking status:', error);
        throw error;
    }
}

// Export functions for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        submitBooking,
        fetchServices,
        fetchBookingStatus
    };
}
