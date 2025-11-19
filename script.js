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
const alertContainer = document.getElementById('alert');
const currentDateElement = document.getElementById('currentDate');
const sideNav = document.getElementById('sideNav');
const closeNav = document.getElementById('closeNav');
const menuBtn = document.getElementById('menuBtn');
const adminMenuBtn = document.getElementById('adminMenuBtn');
const overlay = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-links a');
const bookingForm = document.getElementById('bookingForm');
const bookingsTableBody = document.getElementById('bookingsTableBody');
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const modalBookingForm = document.getElementById('modalBookingForm');
const modalTitle = document.getElementById('modalTitle');
const addBookingBtn = document.getElementById('addBookingBtn');
const exportBtn = document.getElementById('exportBtn');
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

// Sample data for bookings (in a real app, this would come from a database)
let bookings = JSON.parse(localStorage.getItem('kudahHotelBookings')) || [];

// Initialize charts
let bookingChart, roomChart;

// Show alert function
function showAlert(message, type) {
    alertContainer.textContent = message;
    alertContainer.className = `alert ${type} show`;
    
    setTimeout(() => {
        alertContainer.classList.remove('show');
    }, 4000);
}

// Update current date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Toggle side navigation
function toggleNav() {
    sideNav.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Close side navigation
function closeSideNav() {
    sideNav.classList.remove('active');
    overlay.classList.remove('active');
}

// Navigate to section
function navigateToSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
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
        
        closeSideNav();
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
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
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
    
    // In a real app, you would get the user's email from authentication
    // For demo purposes, we'll use a placeholder
    const userEmail = document.getElementById('email') ? document.getElementById('email').value : '';
    
    if (!userEmail) {
        userBookingsContainer.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-receipt"></i>
                <h3>No Bookings Found</h3>
                <p>Please make a booking first or check your email address.</p>
            </div>
        `;
        return;
    }
    
    const userBookings = getUserBookings(userEmail);
    
    if (userBookings.length === 0) {
        userBookingsContainer.innerHTML = `
            <div class="no-bookings">
                <i class="fas fa-receipt"></i>
                <h3>No Bookings Found</h3>
                <p>You haven't made any bookings yet. <a href="#" data-page="book" style="color: var(--gold);">Book now</a> to get started!</p>
            </div>
        `;
        return;
    }
    
    userBookings.forEach(booking => {
        const days = calculateDaysBetweenDates(booking.checkIn, booking.checkOut);
        const receipt = document.createElement('div');
        receipt.className = 'booking-receipt';
        receipt.innerHTML = `
            <div class="receipt-header">
                <h3>Booking Receipt</h3>
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
            <div class="receipt-item form-group-full">
                <label>Special Requests</label>
                <span>${booking.specialRequests || 'None'}</span>
            </div>
            <div class="receipt-status status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</div>
        `;
        userBookingsContainer.appendChild(receipt);
    });
}

// Render bookings table
function renderBookingsTable() {
    bookingsTableBody.innerHTML = '';
    
    if (bookings.length === 0) {
        bookingsTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No bookings found</td></tr>';
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
            <td><span class="status ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" data-id="${booking.id}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" data-id="${booking.id}"><i class="fas fa-trash"></i></button>
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
        bookingModal.classList.add('active');
    }
}

// Delete booking handler
function deleteBookingHandler(id) {
    if (confirm('Are you sure you want to delete this booking?')) {
        if (deleteBooking(id)) {
            renderBookingsTable();
            updateDashboardStats();
            showAlert('Booking deleted successfully', 'success');
        } else {
            showAlert('Failed to delete booking', 'error');
        }
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate stats
    const occupiedRooms = bookings.filter(b => b.status === 'confirmed').length;
    const totalGuests = bookings.filter(b => b.status === 'confirmed')
        .reduce((sum, booking) => sum + parseInt(booking.guests), 0);
    const checkinsToday = bookings.filter(b => b.checkIn === today && b.status === 'confirmed').length;
    const pendingRequests = bookings.filter(b => b.status === 'pending').length;
    
    // Update UI
    occupiedRoomsElement.textContent = occupiedRooms;
    totalGuestsElement.textContent = totalGuests;
    checkinsTodayElement.textContent = checkinsToday;
    pendingRequestsElement.textContent = pendingRequests;
}

// Initialize charts
function initCharts() {
    const bookingCtx = document.getElementById('bookingChart').getContext('2d');
    const roomCtx = document.getElementById('roomChart').getContext('2d');
    
    // Booking trends chart
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();
    
    const bookingsByDay = last7Days.map(day => {
        return bookings.filter(b => b.checkIn === day).length;
    });
    
    bookingChart = new Chart(bookingCtx, {
        type: 'line',
        data: {
            labels: last7Days.map(d => new Date(d).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})),
            datasets: [{
                label: 'Bookings',
                data: bookingsByDay,
                borderColor: '#3182ce',
                backgroundColor: 'rgba(49, 130, 206, 0.1)',
                tension: 0.4,
                fill: true
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
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Room type distribution chart
    const roomTypes = ['standard', 'deluxe', 'suite', 'executive'];
    const roomCounts = roomTypes.map(type => 
        bookings.filter(b => b.roomType === type).length
    );
    
    roomChart = new Chart(roomCtx, {
        type: 'doughnut',
        data: {
            labels: ['Standard', 'Deluxe', 'Suite', 'Executive'],
            datasets: [{
                data: roomCounts,
                backgroundColor: [
                    '#3182ce',
                    '#38a169',
                    '#d69e2e',
                    '#e53e3e'
                ]
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

// Update charts
function updateCharts() {
    // Update booking trends chart
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();
    
    const bookingsByDay = last7Days.map(day => {
        return bookings.filter(b => b.checkIn === day).length;
    });
    
    bookingChart.data.datasets[0].data = bookingsByDay;
    bookingChart.update();
    
    // Update room type distribution chart
    const roomTypes = ['standard', 'deluxe', 'suite', 'executive'];
    const roomCounts = roomTypes.map(type => 
        bookings.filter(b => b.roomType === type).length
    );
    
    roomChart.data.datasets[0].data = roomCounts;
    roomChart.update();
}

// Export to CSV
function exportToCSV() {
    if (bookings.length === 0) {
        showAlert('No data to export', 'warning');
        return;
    }
    
    const headers = ['Booking ID', 'Guest Name', 'Email', 'Phone', 'Room Type', 'Check-in', 'Check-out', 'Guests', 'Status', 'Special Requests'];
    const csvData = bookings.map(booking => [
        booking.id,
        `${booking.firstName} ${booking.lastName}`,
        booking.email,
        booking.phone,
        booking.roomType,
        booking.checkIn,
        booking.checkOut,
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
    
    showAlert('Data exported successfully', 'success');
}

// Set minimum dates for date inputs
function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const modalCheckInInput = document.getElementById('modalCheckIn');
    const modalCheckOutInput = document.getElementById('modalCheckOut');
    
    if (checkInInput) checkInInput.min = today;
    if (checkOutInput) checkOutInput.min = today;
    if (modalCheckInInput) modalCheckInInput.min = today;
    if (modalCheckOutInput) modalCheckOutInput.min = today;
}

// Event Listeners
adminCard.addEventListener('click', () => {
    splashScreen.classList.add('hidden');
    setTimeout(() => {
        loginPage.classList.add('active');
    }, 800);
});

userCard.addEventListener('click', () => {
    splashScreen.classList.add('hidden');
    setTimeout(() => {
        userHome.classList.add('active');
        showAlert('Welcome to Kudah Hotel!', 'success');
        setMinDates();
    }, 800);
});

backToSplash.addEventListener('click', (e) => {
    e.preventDefault();
    loginPage.classList.remove('active');
    setTimeout(() => {
        splashScreen.classList.remove('hidden');
    }, 500);
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        loginPage.classList.remove('active');
        setTimeout(() => {
            adminDashboard.classList.add('active');
            showAlert('Login successful! Welcome to the dashboard.', 'success');
            updateDate();
            renderBookingsTable();
            updateDashboardStats();
            initCharts();
            setMinDates();
        }, 500);
    } else {
        showAlert('Invalid credentials. Please try again.', 'error');
    }
});

logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    adminDashboard.classList.remove('active');
    setTimeout(() => {
        splashScreen.classList.remove('hidden');
        showAlert('You have been logged out successfully.', 'success');
    }, 500);
});

menuBtn.addEventListener('click', toggleNav);
adminMenuBtn.addEventListener('click', toggleNav);
closeNav.addEventListener('click', closeSideNav);
overlay.addEventListener('click', closeSideNav);

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        navigateToSection(`${page}Section`);
    });
});

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
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
    
    // Calculate days
    const days = calculateDaysBetweenDates(formData.checkIn, formData.checkOut);
    
    const newBooking = addBooking(formData);
    bookingForm.reset();
    setMinDates();
    
    showAlert(`Booking submitted successfully, ${formData.firstName}! Your booking ID is ${newBooking.id}. You will be staying for ${days} ${days === 1 ? 'day' : 'days'}.`, 'success');
    
    // If admin is logged in, update the dashboard
    if (adminDashboard.classList.contains('active')) {
        renderBookingsTable();
        updateDashboardStats();
        updateCharts();
    }
});

addBookingBtn.addEventListener('click', () => {
    modalBookingForm.reset();
    document.getElementById('bookingId').value = '';
    modalTitle.textContent = 'Add New Booking';
    bookingModal.classList.add('active');
    setMinDates();
});

closeModal.addEventListener('click', () => {
    bookingModal.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    bookingModal.classList.remove('active');
});

modalBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
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
    
    const bookingId = document.getElementById('bookingId').value;
    
    if (bookingId) {
        // Update existing booking
        if (updateBooking(bookingId, formData)) {
            renderBookingsTable();
            updateDashboardStats();
            updateCharts();
            showAlert('Booking updated successfully', 'success');
        } else {
            showAlert('Failed to update booking', 'error');
        }
    } else {
        // Add new booking
        const newBooking = addBooking(formData);
        renderBookingsTable();
        updateDashboardStats();
        updateCharts();
        showAlert(`Booking added successfully! Booking ID: ${newBooking.id}`, 'success');
    }
    
    bookingModal.classList.remove('active');
});

exportBtn.addEventListener('click', exportToCSV);

// Initialize date on page load
updateDate();