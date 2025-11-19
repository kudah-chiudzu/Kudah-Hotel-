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
const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
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
    const toast = new bootstrap.Toast(alertToast);
    const toastBody = alertToast.querySelector('.toast-body');
    
    alertToast.className = `toast align-items-center text-white border-0 ${type === 'success' ? 'success' : type === 'error' ? 'error' : 'warning'}`;
    toastBody.textContent = message;
    
    toast.show();
}

// Update current date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Toggle sidebar
function toggleSidebar() {
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
}

// Close sidebar
function closeSidebarFunc() {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
}

// Navigate to section
function navigateToSection(sectionId) {
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
        createdAt: new Date().toISOString()
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
                <p class="text-muted">You haven't made any bookings yet. <a href="#" data-page="book" class="text-gold">Book now</a> to get started!</p>
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
    if (booking) {
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
    // Booking Trends Chart
    const bookingCtx = document.getElementById('bookingChart').getContext('2d');
    const roomCtx = document.getElementById('roomChart').getContext('2d');
    
    // Sample data for booking trends (last 7 days)
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

// Initialize the application
function init() {
    // Set minimum dates for booking forms
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn')?.setAttribute('min', today);
    document.getElementById('checkOut')?.setAttribute('min', today);
    document.getElementById('modalCheckIn')?.setAttribute('min', today);
    document.getElementById('modalCheckOut')?.setAttribute('min', today);
    
    // Update date
    updateDate();
    
    // Render initial data
    renderBookingsTable();
    updateDashboardStats();
    initializeCharts();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    init();
    
    // User type selection
    adminCard.addEventListener('click', function() {
        splashScreen.classList.add('hidden');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            loginPage.classList.add('active');
        }, 800);
    });
    
    userCard.addEventListener('click', function() {
        splashScreen.classList.add('hidden');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            userHome.style.display = 'block';
        }, 800);
    });
    
    // Back to splash from login
    backToSplash.addEventListener('click', function(e) {
        e.preventDefault();
        loginPage.classList.remove('active');
        setTimeout(() => {
            splashScreen.style.display = 'flex';
            splashScreen.classList.remove('hidden');
        }, 300);
    });
    
    // Admin login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === adminCredentials.username && password === adminCredentials.password) {
            loginPage.classList.remove('active');
            adminDashboard.style.display = 'block';
            showAlert('Welcome to Admin Dashboard!');
        } else {
            showAlert('Invalid credentials. Please try again.', 'error');
        }
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (adminDashboard.style.display === 'block') {
            adminDashboard.style.display = 'none';
        } else {
            userHome.style.display = 'none';
        }
        
        // Clear any form data
        document.getElementById('bookingForm')?.reset();
        document.getElementById('loginForm')?.reset();
        
        // Show splash screen
        splashScreen.style.display = 'flex';
        setTimeout(() => {
            splashScreen.classList.remove('hidden');
        }, 50);
    });
    
    // Sidebar functionality
    menuBtn.addEventListener('click', toggleSidebar);
    closeSidebar.addEventListener('click', closeSidebarFunc);
    overlay.addEventListener('click', closeSidebarFunc);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToSection(page + 'Section');
        });
    });
    
    // User booking form
    bookingForm?.addEventListener('submit', function(e) {
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
    
    // Admin add booking button
    addBookingBtn?.addEventListener('click', function() {
        document.getElementById('bookingId').value = '';
        modalBookingForm.reset();
        modalTitle.textContent = 'Add New Booking';
        bookingModal.show();
    });
    
    // Save booking in modal (for admin)
    saveBookingBtn?.addEventListener('click', function() {
        const bookingId = document.getElementById('bookingId').value;
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
            bookingModal.hide();
            showAlert(message);
        } else {
            showAlert('Failed to save booking', 'error');
        }
    });
    
    // Export functionality
    exportBtn?.addEventListener('click', exportToCSV);
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            bookingModal.hide();
        }
    });
});

// Make functions available globally for HTML onclick events
window.navigateToSection = navigateToSection;
