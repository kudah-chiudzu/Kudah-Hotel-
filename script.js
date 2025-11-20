// DOM Elements
const splashScreen = document.getElementById('splashScreen');
const loginPage = document.getElementById('loginPage');
const userHome = document.getElementById('userHome');
const adminDashboard = document.getElementById('adminDashboard');
const adminCard = document.getElementById('adminCard');
const userCard = document.getElementById('userCard');
const backToSplash = document.getElementById('backToSplash');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const alertToast = document.getElementById('alert');
const currentDateElement = document.getElementById('currentDate');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const menuBtn = document.getElementById('menuBtn');
const overlay = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-link');
const bookingForm = document.getElementById('bookingForm');
const bookingsTableBody = document.getElementById('bookingsTableBody');
const bookingModal = document.getElementById('bookingModal') ? new bootstrap.Modal(document.getElementById('bookingModal')) : null;
const modalBookingForm = document.getElementById('modalBookingForm');
const modalTitle = document.getElementById('modalTitle');
const addBookingBtn = document.getElementById('addBookingBtn');
const exportBtn = document.getElementById('exportBtn');
const saveBookingBtn = document.getElementById('saveBookingBtn');
const occupiedRoomsElement = document.getElementById('occupiedRooms');
const totalGuestsElement = document.getElementById('totalGuests');
const checkinsTodayElement = document.getElementById('checkinsToday');
const pendingRequestsElement = document.getElementById('pendingRequests');
const userBookingsContainer = document.getElementById('userBookingsContainer');

// Default admin credentials
const adminCredentials = {
    username: 'admin',
    password: 'password123'
};

// Initialize booking counter
let bookingCounter = JSON.parse(localStorage.getItem('kudahHotelBookingCounter')) || 1000;

// Sample data for bookings
let bookings = JSON.parse(localStorage.getItem('kudahHotelBookings')) || [];

// Initialize charts
let bookingChart, roomChart;

// Show alert function
function showAlert(message, type = 'success') {
    if (!alertToast) {
        console.log('Alert:', message, type);
        return;
    }
    
    const toast = new bootstrap.Toast(alertToast);
    const toastBody = alertToast.querySelector('.toast-body');
    
    // Remove existing classes
    alertToast.className = 'toast align-items-center text-white border-0';
    
    // Add appropriate class based on type
    if (type === 'success') {
        alertToast.classList.add('success');
    } else if (type === 'error') {
        alertToast.classList.add('error');
    } else if (type === 'warning') {
        alertToast.classList.add('warning');
    }
    
    toastBody.textContent = message;
    toast.show();
}

// Update current date
function updateDate() {
    if (!currentDateElement) return;
    
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Toggle sidebar
function toggleSidebar() {
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
    document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
}

// Close sidebar
function closeSidebarFunc() {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Navigate to section
function navigateToSection(sectionId) {
    console.log('Navigating to:', sectionId);
    
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === sectionId.replace('Section', '')) {
                link.classList.add('active');
            }
        });
        
        // If navigating to My Bookings, render user bookings
        if (sectionId === 'myBookingsSection') {
            renderUserBookings();
        }
        
        closeSidebarFunc();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        console.error('Section not found:', sectionId);
    }
}

// Generate sequential booking ID
function generateBookingId() {
    bookingCounter++;
    localStorage.setItem('kudahHotelBookingCounter', JSON.stringify(bookingCounter));
    return 'KH-' + bookingCounter;
}

// Calculate days between dates
function calculateDaysBetweenDates(checkIn, checkOut) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(checkIn);
    const secondDate = new Date(checkOut);
    
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

// Add booking
function addBooking(bookingData) {
    const newBooking = {
        id: generateBookingId(),
        ...bookingData,
        createdAt: new Date().toISOString(),
        status: bookingData.status || 'pending'
    };
    bookings.push(newBooking);
    localStorage.setItem('kudahHotelBookings', JSON.stringify(bookings));
    return newBooking;
}

// Update booking
function updateBooking(id, updatedData) {
    const index = bookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
        bookings[index] = { ...bookings[index], ...updatedData };
        localStorage.setItem('kudahHotelBookings', JSON.stringify(bookings));
        return true;
    }
    return false;
}

// Delete booking
function deleteBooking(id) {
    const index = bookings.findIndex(booking => booking.id === id);
    if (index !== -1) {
        bookings.splice(index, 1);
        localStorage.setItem('kudahHotelBookings', JSON.stringify(bookings));
        return true;
    }
    return false;
}

// Get user bookings by email
function getUserBookings(email) {
    return bookings.filter(booking => booking.email === email);
}

// Render user bookings
function renderUserBookings() {
    if (!userBookingsContainer) return;
    
    userBookingsContainer.innerHTML = '';
    
    const userEmail = document.getElementById('email') ? document.getElementById('email').value : '';
    
    if (!userEmail) {
        userBookingsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-receipt fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No Bookings Found</h4>
                <p class="text-muted">Please make a booking first or check your email address.</p>
            </div>
        `;
        return;
    }
    
    const userBookings = getUserBookings(userEmail);
    
    if (userBookings.length === 0) {
        userBookingsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-receipt fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No Bookings Found</h4>
                <p class="text-muted">You haven't made any bookings yet. <a href="#" onclick="navigateToSection('bookSection')" class="text-gold">Book now</a> to get started!</p>
            </div>
        `;
        return;
    }
    
    userBookings.forEach(booking => {
        const days = calculateDaysBetweenDates(booking.checkIn, booking.checkOut);
        const receipt = document.createElement('div');
        receipt.className = 'booking-receipt mb-4';
        receipt.innerHTML = `
            <div class="receipt-header">
                <h4 class="mb-0">Booking Receipt</h4>
                <div class="booking-id">${booking.id}</div>
            </div>
            <div class="receipt-details">
                <div class="receipt-item">
                    <label>Guest Name</label>
                    <span>${booking.firstName} ${booking.lastName}</span>
                </div>
                <div class="receipt-item">
                    <label>Email</label>
                    <span>${booking.email}</span>
                </div>
                <div class="receipt-item">
                    <label>Phone</label>
                    <span>${booking.phone}</span>
                </div>
                <div class="receipt-item">
                    <label>Room Type</label>
                    <span>${booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)}</span>
                </div>
                <div class="receipt-item">
                    <label>Check-in</label>
                    <span>${new Date(booking.checkIn).toLocaleDateString()}</span>
                </div>
                <div class="receipt-item">
                    <label>Check-out</label>
                    <span>${new Date(booking.checkOut).toLocaleDateString()}</span>
                </div>
                <div class="receipt-item">
                    <label>Duration</label>
                    <span>${days} ${days === 1 ? 'day' : 'days'}</span>
                </div>
                <div class="receipt-item">
                    <label>Guests</label>
                    <span>${booking.guests}</span>
                </div>
            </div>
            <div class="receipt-item">
                <label>Special Requests</label>
                <span>${booking.specialRequests || 'None'}</span>
            </div>
            <div class="receipt-status status-${booking.status}">
                ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
        `;
        userBookingsContainer.appendChild(receipt);
    });
}

// Render bookings table
function renderBookingsTable() {
    if (!bookingsTableBody) return;
    
    bookingsTableBody.innerHTML = '';
    
    if (bookings.length === 0) {
        bookingsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    <i class="fas fa-inbox fa-2x mb-2"></i>
                    <p class="mb-0">No bookings found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.firstName} ${booking.lastName}</td>
            <td>${booking.roomType.charAt(0).toUpperCase() + booking.roomType.slice(1)}</td>
            <td>${new Date(booking.checkIn).toLocaleDateString()}</td>
            <td>${new Date(booking.checkOut).toLocaleDateString()}</td>
            <td>${booking.guests}</td>
            <td>
                <span class="badge bg-${booking.status === 'confirmed' ? 'success' : booking.status === 'pending' ? 'warning' : 'danger'}">
                    ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-btn me-1" data-id="${booking.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${booking.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        bookingsTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteBookingHandler(btn.getAttribute('data-id')));
    });
}

// Open edit modal
function openEditModal(id) {
    const booking = bookings.find(b => b.id === id);
    if (booking && bookingModal) {
        document.getElementById('bookingId').value = booking.id;
        document.getElementById('modalFirstName').value = booking.firstName;
        document.getElementById('modalLastName').value = booking.lastName;
        document.getElementById('modalEmail').value = booking.email;
        document.getElementById('modalPhone').value = booking.phone;
        document.getElementById('modalCheckIn').value = booking.checkIn;
        document.getElementById('modalCheckOut').value = booking.checkOut;
        document.getElementById('modalRoomType').value = booking.roomType;
        document.getElementById('modalGuests').value = booking.guests;
        document.getElementById('modalStatus').value = booking.status;
        document.getElementById('modalSpecialRequests').value = booking.specialRequests || '';
        
        modalTitle.textContent = 'Edit Booking';
        bookingModal.show();
    }
}

// Delete booking handler
function deleteBookingHandler(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        if (deleteBooking(id)) {
            renderBookingsTable();
            updateDashboardStats();
            showAlert('Booking deleted successfully');
        } else {
            showAlert('Failed to delete booking', 'error');
        }
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    if (!occupiedRoomsElement) return;
    
    const today = new Date().toDateString();
    
    const occupiedRooms = bookings.filter(booking => 
        booking.status === 'confirmed' || booking.status === 'pending'
    ).length;
    
    const totalGuests = bookings.reduce((total, booking) => 
        total + parseInt(booking.guests), 0
    );
    
    const checkinsToday = bookings.filter(booking => 
        new Date(booking.checkIn).toDateString() === today
    ).length;
    
    const pendingRequests = bookings.filter(booking => 
        booking.status === 'pending'
    ).length;
    
    occupiedRoomsElement.textContent = occupiedRooms;
    totalGuestsElement.textContent = totalGuests;
    checkinsTodayElement.textContent = checkinsToday;
    pendingRequestsElement.textContent = pendingRequests;
}

// Initialize charts
function initializeCharts() {
    const bookingCtx = document.getElementById('bookingChart');
    const roomCtx = document.getElementById('roomChart');
    
    if (!bookingCtx || !roomCtx) return;
    
    // Destroy existing charts
    if (bookingChart) bookingChart.destroy();
    if (roomChart) roomChart.destroy();
    
    // Booking Trends Chart
    const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    }).reverse();
    
    const bookingData = Array.from({length: 7}, () => Math.floor(Math.random() * 20) + 5);
    
    bookingChart = new Chart(bookingCtx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Bookings',
                data: bookingData,
                borderColor: '#3182ce',
                backgroundColor: 'rgba(49, 130, 206, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Room Distribution Chart
    const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive'];
    const roomCounts = roomTypes.map(type => 
        bookings.filter(booking => 
            booking.roomType === type.toLowerCase()
        ).length
    );
    
    roomChart = new Chart(roomCtx, {
        type: 'doughnut',
        data: {
            labels: roomTypes,
            datasets: [{
                data: roomCounts,
                backgroundColor: [
                    '#3182ce',
                    '#38a169',
                    '#d69e2e',
                    '#d4af37'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Export bookings to CSV
function exportToCSV() {
    if (bookings.length === 0) {
        showAlert('No bookings to export', 'warning');
        return;
    }
    
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Room Type', 'Check-in', 'Check-out', 'Guests', 'Status', 'Special Requests'];
    const csvData = bookings.map(booking => [
        booking.id,
        booking.firstName,
        booking.lastName,
        booking.email,
        booking.phone,
        booking.roomType,
        new Date(booking.checkIn).toLocaleDateString(),
        new Date(booking.checkOut).toLocaleDateString(),
        booking.guests,
        booking.status,
        booking.specialRequests || ''
    ]);
    
    const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kudah-hotel-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('Bookings exported successfully');
}

// Validate booking dates
function validateBookingDates(checkIn, checkOut) {
    if (!checkIn || !checkOut) {
        return { valid: false, message: 'Please select both check-in and check-out dates' };
    }
    
    const today = new Date().toISOString().split('T')[0];
    if (checkIn < today) {
        return { valid: false, message: 'Check-in date cannot be in the past' };
    }
    
    if (checkIn >= checkOut) {
        return { valid: false, message: 'Check-out date must be after check-in date' };
    }
    
    return { valid: true };
}

// Initialize the application
function init() {
    console.log('Initializing Kudah Hotel App...');
    
    // Set minimum dates for booking forms
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const modalCheckIn = document.getElementById('modalCheckIn');
    const modalCheckOut = document.getElementById('modalCheckOut');
    
    if (checkInInput) checkInInput.setAttribute('min', today);
    if (checkOutInput) checkOutInput.setAttribute('min', today);
    if (modalCheckIn) modalCheckIn.setAttribute('min', today);
    if (modalCheckOut) modalCheckOut.setAttribute('min', today);
    
    // Update date
    updateDate();
    
    // Render initial data
    renderBookingsTable();
    updateDashboardStats();
    initializeCharts();
    
    console.log('App initialized successfully');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize app
    init();
    
    // User type selection
    if (adminCard) {
        adminCard.addEventListener('click', function() {
            console.log('Admin card clicked');
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                loginPage.classList.add('active');
            }, 800);
        });
    }
    
    if (userCard) {
        userCard.addEventListener('click', function() {
            console.log('User card clicked');
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                if (userHome) userHome.style.display = 'block';
            }, 800);
        });
    }
    
    // Back to splash from login
    if (backToSplash) {
        backToSplash.addEventListener('click', function(e) {
            e.preventDefault();
            loginPage.classList.remove('active');
            setTimeout(() => {
                splashScreen.style.display = 'flex';
                splashScreen.classList.remove('hidden');
            }, 300);
        });
    }
    
    // Admin login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === adminCredentials.username && password === adminCredentials.password) {
                loginPage.classList.remove('active');
                if (adminDashboard) adminDashboard.style.display = 'block';
                showAlert('Welcome to Admin Dashboard!');
                // Reinitialize charts for admin dashboard
                setTimeout(() => {
                    initializeCharts();
                    updateDashboardStats();
                }, 100);
            } else {
                showAlert('Invalid credentials. Please try again.', 'error');
            }
        });
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (adminDashboard && adminDashboard.style.display === 'block') {
                adminDashboard.style.display = 'none';
            } else if (userHome && userHome.style.display === 'block') {
                userHome.style.display = 'none';
            }
            
            // Clear any form data
            if (document.getElementById('bookingForm')) document.getElementById('bookingForm').reset();
            if (document.getElementById('loginForm')) document.getElementById('loginForm').reset();
            
            // Show splash screen
            splashScreen.style.display = 'flex';
            setTimeout(() => {
                splashScreen.classList.remove('hidden');
            }, 50);
        });
    }
    
    // Sidebar functionality
    if (menuBtn) {
        menuBtn.addEventListener('click', toggleSidebar);
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarFunc);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeSidebarFunc);
    }

    document.getElementById('sidebar').classList.add('active'); // Show sidebar
document.getElementById('sidebar').classList.remove('active'); // Hide sidebar
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToSection(page + 'Section');
        });
    });
    
    // User booking form
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const bookingData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                checkIn: document.getElementById('checkIn').value,
                checkOut: document.getElementById('checkOut').value,
                roomType: document.getElementById('roomType').value,
                guests: document.getElementById('guests').value,
                specialRequests: document.getElementById('specialRequests').value,
                status: 'pending'
            };
            
            // Validate dates
            const validation = validateBookingDates(bookingData.checkIn, bookingData.checkOut);
            if (!validation.valid) {
                showAlert(validation.message, 'error');
                return;
            }
            
            const newBooking = addBooking(bookingData);
            
            // Reset form
            this.reset();
            
            // Show success message
            showAlert(`Booking created successfully! Your booking ID is ${newBooking.id}`);
            
            // Navigate to my bookings
            setTimeout(() => {
                navigateToSection('myBookingsSection');
            }, 2000);
        });
    }
    
    // Admin add booking button
    if (addBookingBtn) {
        addBookingBtn.addEventListener('click', function() {
            if (document.getElementById('bookingId')) {
                document.getElementById('bookingId').value = '';
            }
            if (modalBookingForm) {
                modalBookingForm.reset();
            }
            if (modalTitle) {
                modalTitle.textContent = 'Add New Booking';
            }
            if (bookingModal) {
                bookingModal.show();
            }
        });
    }
    
    // Save booking in modal (for admin)
    if (saveBookingBtn) {
        saveBookingBtn.addEventListener('click', function() {
            const bookingId = document.getElementById('bookingId') ? document.getElementById('bookingId').value : '';
            const bookingData = {
                firstName: document.getElementById('modalFirstName').value,
                lastName: document.getElementById('modalLastName').value,
                email: document.getElementById('modalEmail').value,
                phone: document.getElementById('modalPhone').value,
                checkIn: document.getElementById('modalCheckIn').value,
                checkOut: document.getElementById('modalCheckOut').value,
                roomType: document.getElementById('modalRoomType').value,
                guests: document.getElementById('modalGuests').value,
                status: document.getElementById('modalStatus').value,
                specialRequests: document.getElementById('modalSpecialRequests').value
            };
            
            // Validate dates for new bookings
            if (!bookingId) {
                const validation = validateBookingDates(bookingData.checkIn, bookingData.checkOut);
                if (!validation.valid) {
                    showAlert(validation.message, 'error');
                    return;
                }
            }
            
            let success = false;
            let message = '';
            
            if (bookingId) {
                // Update existing booking
                success = updateBooking(bookingId, bookingData);
                message = 'Booking updated successfully';
            } else {
                // Add new booking
                const newBooking = addBooking(bookingData);
                success = true;
                message = `Booking created successfully! ID: ${newBooking.id}`;
            }
            
            if (success) {
                renderBookingsTable();
                updateDashboardStats();
                initializeCharts();
                if (bookingModal) bookingModal.hide();
                showAlert(message);
            } else {
                showAlert('Failed to save booking', 'error');
            }
        });
    }
    
    // Export functionality
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
    
    // Handle window resize for charts
    window.addEventListener('resize', function() {
        if (adminDashboard.style.display === 'block') {
            initializeCharts();
        }
    });
});

// Make functions available globally for HTML onclick events
window.navigateToSection = navigateToSection;
window.toggleSidebar = toggleSidebar;

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close sidebar and modals
    if (e.key === 'Escape') {
        closeSidebarFunc();
        if (bookingModal) {
            bookingModal.hide();
        }
    }
});

