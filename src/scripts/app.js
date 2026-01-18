// Service data
const services = [
    {
        id: 1,
        name: 'Plumbing',
        description: 'Expert plumbing services for all your water and drainage needs. From leak repairs to complete installations.',
        icon: '🔧',
        image: 'assests/booking/plumbing.jpg',
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
        image: 'assests/booking/electrical.jpg',
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
        image: 'assests/booking/ac.jpg',
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
        image: 'assests/booking/carpenter.jpg',
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
const contactForm = document.getElementById('contactForm');
const servicesGrid = document.getElementById('servicesGrid');

// ... [Keep existing Service Data and DOM Elements code] ...

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeServices(); // Only runs if on home page
    initializeModal();
    initializeForm();
    initializeContactForm();
    initializeSmoothScroll();
    
    // NEW: Check login state and handle profile page
    checkAuthState();
    if (window.location.pathname.includes('profile.html')) {
        initializeProfilePage();
    }
});

// NEW: Auth State Management
function checkAuthState() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navMenu = document.querySelector('.nav-menu');
    const authLinks = document.querySelectorAll('.auth-link'); // Login/Register LIs
    
    if (currentUser && navMenu) {
        // Hide Login/Register
        authLinks.forEach(link => link.style.display = 'none');

        // Add Profile Link if not already present
        if (!document.querySelector('.nav-profile-item')) {
            const profileLi = document.createElement('li');
            profileLi.className = 'nav-profile-item';
            profileLi.innerHTML = `
                <a href="profile.html" class="nav-profile-link">
                    <div class="nav-profile-icon">👤</div>
                    <span>Profile</span>
                </a>
            `;
            navMenu.appendChild(profileLi);
        }
    }
}

// NEW: Profile Page Logic
function initializeProfilePage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Redirect if not logged in
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Elements
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const cancelBtn = document.getElementById('cancelProfileBtn');
    const uploadBtn = document.getElementById('uploadAvatarBtn');
    const profileForm = document.getElementById('profileForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const messageArea = document.getElementById('profileMessage');

    // Fetch Profile Data
    fetchProfileData(currentUser.email);

    // Toggle Edit Mode
    editBtn.addEventListener('click', () => {
        setEditMode(true);
    });

    cancelBtn.addEventListener('click', () => {
        setEditMode(false);
        // Reset values to saved state (re-fetch or use cached)
        fetchProfileData(currentUser.email); 
    });

    // Handle Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Handle Save
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedData = {
            email: currentUser.email, // ID
            name: profileName.value,
            // Add other fields as needed
        };

        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        try {
            const response = await fetch('/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('Profile updated successfully!', 'success');
                setEditMode(false);
            } else {
                showMessage(data.message || 'Update failed', 'error');
            }
        } catch (error) {
            console.error('Update error:', error);
            // Fallback for demo
            showMessage('Profile saved (Demo Mode)', 'success');
            setEditMode(false);
        } finally {
            saveBtn.textContent = 'Save Changes';
            saveBtn.disabled = false;
        }
    });

    // Helper: Toggle UI state
    function setEditMode(isEditing) {
        profileName.disabled = !isEditing;
        // Email usually stays disabled as it's the ID
        
        if (isEditing) {
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
            uploadBtn.style.display = 'block';
        } else {
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            uploadBtn.style.display = 'none';
        }
    }

    // Helper: Show messages
    function showMessage(msg, type) {
        messageArea.textContent = msg;
        messageArea.className = 'message-area ' + (type === 'success' ? 'message-success' : 'message-error');
        setTimeout(() => messageArea.textContent = '', 3000);
    }
}

async function fetchProfileData(email) {
    try {
        const res = await fetch(`/profile?email=${email}`);
        
        // Mock data if endpoint missing
        if (!res.ok) throw new Error('Endpoint not found');
        
        const data = await res.json();
        document.getElementById('profileName').value = data.name || '';
        document.getElementById('profileEmail').value = data.email || email;
    } catch (e) {
        // Fallback for demo if backend isn't updated yet
        console.log('Using local/mock profile data');
        document.getElementById('profileName').value = 'User'; 
        document.getElementById('profileEmail').value = email;
    }
}


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

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Render services cards
function initializeServices() {
    if (servicesGrid) {
        servicesGrid.innerHTML = services.map(service => `
            <div class="service-card" data-service-id="${service.id}">
                <div class="service-image-container">
                    <img src="${service.image}" alt="${service.name}" class="service-image">
                </div>
                <div class="service-content">
                    <div class="service-icon">${service.icon}</div>
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <ul class="service-features">
                        ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
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

// Contact form submission
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                // TODO: Replace with actual API endpoint
                console.log('Contact form submission:', formData);
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                alert('Message sent successfully! We will get back to you soon.');
                contactForm.reset();
            } catch (error) {
                console.error('Contact form error:', error);
                alert('An error occurred. Please try again later.');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
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

// --- New Auth Logic ---
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');
const authTitle = document.getElementById('authTitle');
const authMessage = document.getElementById('authMessage');

if (toRegister) {
    toRegister.onclick = () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.innerText = 'Register';
    };
}

if (toLogin) {
    toLogin.onclick = () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        authTitle.innerText = 'Login';
    };
}

// Registration Submit
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPass').value;
        const confirm = document.getElementById('regConfirmPass').value;

        if (password !== confirm) {
            authMessage.innerText = "Passwords do not match!";
            return;
        }

        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        authMessage.innerText = data.message;
        if(data.success) registerForm.reset();
    });
}

// Login Submit
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPass').value;

        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        authMessage.innerText = data.message;
        if (data.success) window.location.href = 'index.html';
    });
}

// --- UPDATED AUTH LOGIC  ---

// Login Submit
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPass').value;

        try {
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (data.success) {
                // SAVE SESSION
                localStorage.setItem('currentUser', JSON.stringify({ email: email }));
                window.location.href = 'index.html';
            } else {
                authMessage.innerText = data.message;
            }
        } catch (error) {
            console.error(error);
            authMessage.innerText = "Login failed. Server might be down.";
        }
    });
}

function initializeProfilePage() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Redirect to login if no user is found
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // --- 1. Get DOM Elements ---
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const avatarInput = document.getElementById('avatarInput');
    const avatarImage = document.getElementById('avatarImage');
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const cancelBtn = document.getElementById('cancelProfileBtn');
    const uploadBtn = document.getElementById('uploadAvatarBtn');
    const profileForm = document.getElementById('profileForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const messageArea = document.getElementById('profileMessage');

    // --- 2. State Tracking (for Cancel logic) ---
    let originalState = {
        name: '',
        avatarSrc: ''
    };

    // --- 3. Initial Data Fetch ---
    fetchProfileData(currentUser.email);

    // --- 4. Event Listeners ---

    // Avatar Upload Click
    uploadBtn.addEventListener('click', () => avatarInput.click());

    // Avatar File Selection (Preview)
    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarImage.src = e.target.result; // Update image tag immediately
                checkForChanges(); // Enable save button
            };
            reader.readAsDataURL(file);
        }
    });

    // Edit Button Click
    editBtn.addEventListener('click', () => {
        setEditMode(true);
        saveBtn.disabled = true; // Start disabled until a change happens
        // Save current state so we can cancel later
        originalState.name = profileName.value;
        originalState.avatarSrc = avatarImage.src;
    });

    // Cancel Button Click
    cancelBtn.addEventListener('click', () => {
        setEditMode(false);
        // Revert to original state
        profileName.value = originalState.name;
        avatarImage.src = originalState.avatarSrc;
        avatarInput.value = ''; // Reset file input
        messageArea.textContent = '';
    });

    // Detect Name Changes
    profileName.addEventListener('input', checkForChanges);

    // Save Changes (Form Submit)
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Prepare data to send
        const updatedData = {
            email: currentUser.email,
            name: profileName.value,
            avatar: avatarImage.src // This sends the Base64 image string
        };

        // UI Updates
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        messageArea.textContent = '';

        try {
            const response = await fetch('/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('Profile updated successfully!', 'success');
                setEditMode(false);
                
                // Update LocalStorage so the header name/icon stays fresh
                currentUser.name = updatedData.name;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            } else {
                showMessage(data.message || 'Update failed', 'error');
                saveBtn.disabled = false;
            }
        } catch (error) {
            console.error('Update error:', error);
            showMessage('Network error: Unable to save. Check server connection.', 'error');
            saveBtn.disabled = false;
        } finally {
            if (!saveBtn.disabled) saveBtn.textContent = 'Save Changes';
        }
    });

    // Logout Logic
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // --- Helper Functions ---

    function checkForChanges() {
        const nameChanged = profileName.value.trim() !== originalState.name;
        const avatarChanged = avatarInput.files.length > 0; // If file input has a file
        
        if (nameChanged || avatarChanged) {
            saveBtn.disabled = false;
        } else {
            saveBtn.disabled = true;
        }
    }

    function setEditMode(isEditing) {
        profileName.disabled = !isEditing;
        if (isEditing) {
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
            uploadBtn.style.display = 'block';
        } else {
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            uploadBtn.style.display = 'none';
        }
    }

    function showMessage(msg, type) {
        messageArea.textContent = msg;
        messageArea.className = 'message-area ' + (type === 'success' ? 'message-success' : 'message-error');
        if (type === 'success') {
            setTimeout(() => messageArea.textContent = '', 3000);
        }
    }
}

async function fetchProfileData(email) {
    try {
        const res = await fetch(`/profile?email=${email}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        
        const data = await res.json();
        
        const nameInput = document.getElementById('profileName');
        const emailInput = document.getElementById('profileEmail');
        const avatarImg = document.getElementById('avatarImage');

        if (nameInput) nameInput.value = data.name || '';
        if (emailInput) emailInput.value = data.email || email;
        
        // If the backend has an avatar, display it. Otherwise keep the default.
        if (data.avatar && avatarImg) {
            avatarImg.src = data.avatar;
        }
    } catch (e) {
        console.error(e);
        const msg = document.getElementById('profileMessage');
        if (msg) {
            msg.textContent = "Could not load profile data.";
            msg.className = "message-area message-error";
        }
    }
}














































