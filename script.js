// ===================================
//  TRAVELLOG - MAIN APPLICATION
// ===================================

// Check if user is logged in
if (!localStorage.getItem('loggedIn')) {
    window.location.href = 'login.html';
}

// ===================================
//  STATE MANAGEMENT
// ===================================

let currentTrip = {
    id: null,
    name: '',
    startDate: '',
    endDate: '',
    destinations: '',
    itinerary: '',
    notes: '',
    budget: 0,
    expenses: [],
    photos: [],
    coverPhoto: null,
    offlineMode: false,
    shareOption: 'private',
    createdAt: null
};

let allTrips = [];
let currentSummary = null;

// ===================================
//  DOM ELEMENTS
// ===================================

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main > section');

// Profile
const profileIcon = document.getElementById('profileIcon');
const profileDropdown = document.getElementById('profileDropdown');
const logoutLink = document.getElementById('logoutLink');

// FAB and Modal
const fabBtn = document.getElementById('fabBtn');
const createTripModal = document.getElementById('createTripModal');
const modalClose = document.getElementById('modalClose');
const cancelTripBtn = document.getElementById('cancelTripBtn');
const saveTripBtn = document.getElementById('saveTripBtn');

// Modal Tabs
const modalTabs = document.querySelectorAll('.modal-tab');
const tabContents = document.querySelectorAll('.tab-content');

// Trip Planner
const tripPlannerForm = document.getElementById('tripPlannerForm');
const tripName = document.getElementById('tripName');
const tripStartDate = document.getElementById('tripStartDate');
const tripEndDate = document.getElementById('tripEndDate');
const tripDestinations = document.getElementById('tripDestinations');
const tripItinerary = document.getElementById('tripItinerary');
const tripNotes = document.getElementById('tripNotes');

// Expenses
const tripBudget = document.getElementById('tripBudget');
const expenseForm = document.getElementById('expenseForm');
const expenseDescription = document.getElementById('expenseDescription');
const expenseAmount = document.getElementById('expenseAmount');
const expenseCategory = document.getElementById('expenseCategory');
const expenseList = document.getElementById('expenseList');
const expenseTotalDisplay = document.getElementById('expenseTotalDisplay');
const expenseChart = document.getElementById('expenseChart');
const chartContainer = document.getElementById('chartContainer');

// Photos
const photoUploadArea = document.getElementById('photoUploadArea');
const photoInput = document.getElementById('photoInput');
const browsePhotosBtn = document.getElementById('browsePhotosBtn');
const photoGallery = document.getElementById('photoGallery');

// AI Summary
const generateSummaryBtn = document.getElementById('generateSummaryBtn');
const summaryOutput = document.getElementById('summaryOutput');
const summaryContent = document.getElementById('summaryContent');
const summaryStats = document.getElementById('summaryStats');
const copySummaryBtn = document.getElementById('copySummaryBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');

// Settings
const offlineMode = document.getElementById('offlineMode');
const coverPhotoInput = document.getElementById('coverPhotoInput');

// Feed
const feedContainer = document.getElementById('feedContainer');
const feedEmpty = document.getElementById('feedEmpty');
const myTripsContainer = document.getElementById('myTripsContainer');

// ===================================
//  EVENT LISTENERS
// ===================================

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = link.getAttribute('data-section');
        showSection(targetSection);

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Profile dropdown
profileIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
});

document.addEventListener('click', () => {
    profileDropdown.classList.remove('show');
});

// Logout
logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
});

// FAB - Open modal
fabBtn.addEventListener('click', () => {
    openCreateTripModal();
});

// Modal close
modalClose.addEventListener('click', closeModal);
cancelTripBtn.addEventListener('click', closeModal);

// Close modal on background click
createTripModal.addEventListener('click', (e) => {
    if (e.target === createTripModal) {
        closeModal();
    }
});

// Modal tabs
modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// Trip form inputs - auto-save to current trip state
tripName.addEventListener('input', () => currentTrip.name = tripName.value);
tripStartDate.addEventListener('change', () => currentTrip.startDate = tripStartDate.value);
tripEndDate.addEventListener('change', () => currentTrip.endDate = tripEndDate.value);
tripDestinations.addEventListener('input', () => currentTrip.destinations = tripDestinations.value);
tripItinerary.addEventListener('input', () => currentTrip.itinerary = tripItinerary.value);
tripNotes.addEventListener('input', () => currentTrip.notes = tripNotes.value);
tripBudget.addEventListener('input', () => currentTrip.budget = parseFloat(tripBudget.value) || 0);
offlineMode.addEventListener('change', () => currentTrip.offlineMode = offlineMode.checked);

document.querySelectorAll('input[name="shareOption"]').forEach(radio => {
    radio.addEventListener('change', (e) => currentTrip.shareOption = e.target.value);
});

// Expense form
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addExpense();
});

// Photos
browsePhotosBtn.addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', handlePhotoUpload);

photoUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    photoUploadArea.classList.add('dragover');
});

photoUploadArea.addEventListener('dragleave', () => {
    photoUploadArea.classList.remove('dragover');
});

photoUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    photoUploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handlePhotoFiles(files);
});

photoUploadArea.addEventListener('click', (e) => {
    if (e.target === photoUploadArea || e.target.closest('#photoUploadArea')) {
        photoInput.click();
    }
});

// Cover photo
coverPhotoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        try {
            const compressed = await compressImage(file);
            currentTrip.coverPhoto = compressed;
            showToast('Cover photo uploaded!', 'success');
        } catch (error) {
            console.error('Error uploading cover photo:', error);
            showToast('Error uploading photo', 'error');
        }
    }
});

// AI Summary
generateSummaryBtn.addEventListener('click', generateSummary);
copySummaryBtn.addEventListener('click', copySummaryToClipboard);
exportPdfBtn.addEventListener('click', exportTripToPDF);

// Save trip
saveTripBtn.addEventListener('click', saveTrip);

// ===================================
//  FUNCTIONS
// ===================================

/**
 * Show specific section
 */
function showSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    if (sectionId === 'my-trips') {
        renderMyTrips();
    }
}

/**
 * Open create trip modal
 */
function openCreateTripModal() {
    resetTripForm();
    createTripModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
function closeModal() {
    createTripModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/**
 * Switch modal tabs
 */
function switchTab(tabName) {
    modalTabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

/**
 * Reset trip form
 */
function resetTripForm() {
    currentTrip = {
        id: generateId(),
        name: '',
        startDate: '',
        endDate: '',
        destinations: '',
        itinerary: '',
        notes: '',
        budget: 0,
        expenses: [],
        photos: [],
        coverPhoto: null,
        offlineMode: false,
        shareOption: 'private',
        createdAt: new Date().toISOString()
    };

    tripPlannerForm.reset();
    expenseForm.reset();
    photoInput.value = '';
    coverPhotoInput.value = '';

    tripBudget.value = '';
    expenseList.innerHTML = '';
    expenseTotalDisplay.textContent = '';
    photoGallery.innerHTML = '';
    summaryOutput.style.display = 'none';
    expenseChart.style.display = 'none';

    offlineMode.checked = false;
    document.querySelector('input[name="shareOption"][value="private"]').checked = true;

    switchTab('planner');
}

/**
 * Add expense
 */
function addExpense() {
    const description = expenseDescription.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value;

    if (!description || !amount || amount <= 0) {
        showToast('Please enter valid expense details', 'error');
        return;
    }

    const expense = {
        id: generateId(),
        description,
        amount,
        category
    };

    currentTrip.expenses.push(expense);
    updateExpenseDisplay();
    expenseForm.reset();
    showToast('Expense added!', 'success');
}

/**
 * Update expense display
 */
function updateExpenseDisplay() {
    // Clear list
    expenseList.innerHTML = '';

    // Calculate total
    const total = currentTrip.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Render expenses
    currentTrip.expenses.forEach(expense => {
        const li = document.createElement('li');
        li.className = 'expense-item';
        li.innerHTML = `
            <div>
                <strong>${expense.description}</strong>
                <span class="expense-category" style="background: rgba(102, 126, 234, 0.1); color: var(--color-primary);">
                    ${getCategoryEmoji(expense.category)} ${expense.category}
                </span>
            </div>
            <div style="font-weight: 700; color: var(--color-primary);">
                ${formatCurrency(expense.amount)}
            </div>
        `;
        expenseList.appendChild(li);
    });

    // Update total
    expenseTotalDisplay.textContent = `Total: ${formatCurrency(total)}`;

    // Show budget warning
    if (currentTrip.budget > 0 && total > currentTrip.budget) {
        expenseTotalDisplay.style.color = '#f5576c';
        expenseTotalDisplay.innerHTML += ` <span style="font-size: 0.9rem;">(Over budget!)</span>`;
    }

    // Update chart
    updateExpenseChart();
}

/**
 * Get category emoji
 */
function getCategoryEmoji(category) {
    const emojis = {
        accommodation: '🏨',
        food: '🍴',
        transport: '🚗',
        activities: '🎭',
        shopping: '🛍️',
        other: '📌'
    };
    return emojis[category] || '📌';
}

/**
 * Update expense chart
 */
function updateExpenseChart() {
    if (currentTrip.expenses.length === 0) {
        expenseChart.style.display = 'none';
        return;
    }

    expenseChart.style.display = 'block';
    chartContainer.innerHTML = '';

    // Calculate category totals
    const categoryTotals = {};
    currentTrip.expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const total = currentTrip.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Create bars
    Object.keys(categoryTotals).forEach(category => {
        const amount = categoryTotals[category];
        const percentage = (amount / total) * 100;

        const barDiv = document.createElement('div');
        barDiv.className = 'chart-bar';
        barDiv.innerHTML = `
            <div class="chart-label">
                <span>${getCategoryEmoji(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <span>${formatCurrency(amount)}</span>
            </div>
            <div class="chart-progress">
                <div class="chart-fill" style="width: ${percentage}%">
                    ${percentage.toFixed(0)}%
                </div>
            </div>
        `;
        chartContainer.appendChild(barDiv);
    });
}

/**
 * Handle photo upload
 */
async function handlePhotoUpload(e) {
    const files = e.target.files;
    await handlePhotoFiles(files);
}

/**
 * Handle photo files
 */
async function handlePhotoFiles(files) {
    if (!files || files.length === 0) return;

    for (let file of files) {
        if (file.type.startsWith('image/')) {
            try {
                const compressed = await compressImage(file);
                const photo = {
                    id: generateId(),
                    src: compressed,
                    caption: '',
                    timestamp: new Date().toISOString()
                };
                currentTrip.photos.push(photo);
            } catch (error) {
                console.error('Error compressing image:', error);
            }
        }
    }

    updatePhotoGallery();
    showToast(`${files.length} photo(s) uploaded!`, 'success');
}

/**
 * Update photo gallery
 */
function updatePhotoGallery() {
    photoGallery.innerHTML = '';

    currentTrip.photos.forEach((photo, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';
        photoDiv.innerHTML = `
            <img src="${photo.src}" alt="Trip photo ${index + 1}">
            <div class="photo-caption">
                <input type="text" placeholder="Add caption..." 
                       style="background: transparent; border: none; color: white; width: 100%; padding: 4px;"
                       value="${photo.caption}"
                       data-photo-id="${photo.id}">
            </div>
        `;

        // Caption input
        const captionInput = photoDiv.querySelector('input');
        captionInput.addEventListener('change', (e) => {
            const photoToUpdate = currentTrip.photos.find(p => p.id === photo.id);
            if (photoToUpdate) {
                photoToUpdate.caption = e.target.value;
            }
        });

        photoGallery.appendChild(photoDiv);
    });
}

/**
 * Generate AI summary
 */
function generateSummary() {
    // Validate trip data
    if (!currentTrip.name || !currentTrip.startDate || !currentTrip.endDate) {
        showToast('Please fill in trip name and dates first', 'error');
        switchTab('planner');
        return;
    }

    // Generate summary using AI
    currentSummary = generateAISummary(currentTrip);

    // Display summary
    summaryContent.innerHTML = `<p style="white-space: pre-line; line-height: 1.8;">${currentSummary.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;

    // Display stats
    summaryStats.innerHTML = '';
    Object.keys(currentSummary.stats).forEach(key => {
        const statDiv = document.createElement('div');
        statDiv.className = 'summary-stat';
        statDiv.innerHTML = `
            <div class="summary-stat-value">${currentSummary.stats[key]}</div>
            <div class="summary-stat-label">${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</div>
        `;
        summaryStats.appendChild(statDiv);
    });

    summaryOutput.style.display = 'block';
    showToast('Summary generated!', 'success');
}

/**
 * Copy summary to clipboard
 */
function copySummaryToClipboard() {
    if (!currentSummary) return;

    navigator.clipboard.writeText(currentSummary.text.replace(/\*\*/g, '')).then(() => {
        showToast('Summary copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
        showToast('Error copying to clipboard', 'error');
    });
}

/**
 * Export trip to PDF
 */
function exportTripToPDF() {
    if (!currentSummary) {
        showToast('Please generate summary first', 'error');
        return;
    }

    exportToPDF(currentTrip, currentSummary);
}

/**
 * Save trip
 */
function saveTrip() {
    // Validate required fields
    if (!currentTrip.name || !currentTrip.startDate || !currentTrip.endDate) {
        showToast('Please fill in trip name and dates', 'error');
        switchTab('planner');
        return;
    }

    // Load existing trips
    allTrips = JSON.parse(localStorage.getItem('trips') || '[]');

    // Check if updating existing trip
    const existingIndex = allTrips.findIndex(t => t.id === currentTrip.id);
    if (existingIndex >= 0) {
        allTrips[existingIndex] = currentTrip;
    } else {
        allTrips.push(currentTrip);
    }

    // Save to localStorage
    localStorage.setItem('trips', JSON.stringify(allTrips));

    showToast('Trip saved successfully!', 'success');
    closeModal();

    // Refresh feed
    renderFeed();
}

/**
 * Render feed
 */
function renderFeed() {
    allTrips = JSON.parse(localStorage.getItem('trips') || '[]');

    if (allTrips.length === 0) {
        feedEmpty.style.display = 'block';
        feedContainer.innerHTML = '';
        feedContainer.appendChild(feedEmpty);
        return;
    }

    feedEmpty.style.display = 'none';
    feedContainer.innerHTML = '';

    // Sort by created date (newest first)
    const sortedTrips = [...allTrips].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    sortedTrips.forEach(trip => {
        const card = createTripCard(trip);
        feedContainer.appendChild(card);
    });
}

/**
 * Render my trips
 */
function renderMyTrips() {
    allTrips = JSON.parse(localStorage.getItem('trips') || '[]');
    myTripsContainer.innerHTML = '';

    if (allTrips.length === 0) {
        myTripsContainer.innerHTML = `
            <div class="feed-empty">
                <i class="fas fa-suitcase"></i>
                <h3>No trips yet!</h3>
                <p>Start creating your travel memories by clicking the + button</p>
            </div>
        `;
        return;
    }

    allTrips.forEach(trip => {
        const card = createTripCard(trip);
        myTripsContainer.appendChild(card);
    });
}

/**
 * Create trip card
 */
function createTripCard(trip) {
    const card = document.createElement('div');
    card.className = 'trip-card';

    const duration = calculateDaysBetween(trip.startDate, trip.endDate);
    const totalExpenses = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const imageUrl = trip.coverPhoto || trip.photos[0]?.src || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=240&fit=crop';

    card.innerHTML = `
        <img src="${imageUrl}" alt="${trip.name}" class="trip-card-image" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=240&fit=crop'">
        <div class="trip-card-content">
            <div class="trip-card-header">
                <div>
                    <h3 class="trip-card-title">${trip.name}</h3>
                    <div class="trip-card-date">
                        <i class="fas fa-calendar"></i> ${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}
                    </div>
                </div>
                <div class="trip-card-badge">${duration} Days</div>
            </div>
            <p class="trip-card-summary">${trip.destinations || 'Exploring new destinations'}</p>
            <div class="trip-card-stats">
                ${totalExpenses > 0 ? `<div class="trip-stat"><i class="fas fa-dollar-sign"></i> ${formatCurrency(totalExpenses)}</div>` : ''}
                ${trip.photos.length > 0 ? `<div class="trip-stat"><i class="fas fa-camera"></i> ${trip.photos.length} photos</div>` : ''}
                ${trip.expenses.length > 0 ? `<div class="trip-stat"><i class="fas fa-receipt"></i> ${trip.expenses.length} expenses</div>` : ''}
            </div>
        </div>
    `;

    return card;
}

/**
 * Initialize app
 */
function init() {
    // Load trips
    allTrips = JSON.parse(localStorage.getItem('trips') || '[]');

    // Check for shared trip in URL
    const sharedTrip = loadTripFromURL();
    if (sharedTrip) {
        // Display shared trip
        showToast('Viewing shared trip!', 'success');
        // You could open it in a view-only mode or save it
    }

    // Render feed
    renderFeed();

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    tripStartDate.setAttribute('min', today);
    tripEndDate.setAttribute('min', today);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
