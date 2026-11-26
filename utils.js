// ===================================
//  UTILITY FUNCTIONS
// ===================================

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Calculate days between two dates
 */
function calculateDaysBetween(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end day
    return diffDays;
}

/**
 * Compress image before storing
 */
function compressImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                }, 'image/jpeg', quality);
            };
        };
        reader.onerror = error => reject(error);
    });
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

/**
 * Generate AI Summary using client-side analysis
 */
function generateAISummary(tripData) {
    const { name, startDate, endDate, destinations, itinerary, notes, expenses, photos } = tripData;

    // Calculate statistics
    const duration = calculateDaysBetween(startDate, endDate);
    const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const photoCount = photos.length;

    // Category analysis
    const categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount);
    });

    const topCategory = Object.keys(categoryTotals).length > 0
        ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
        : 'N/A';

    const avgDailySpend = duration > 0 ? totalExpenses / duration : 0;

    // Destination count
    const destinationList = destinations ? destinations.split(',').map(d => d.trim()).filter(d => d) : [];
    const destinationCount = destinationList.length;

    // Generate summary text
    let summaryText = `**${name}** was an amazing ${duration}-day adventure`;
    if (destinationCount > 0) {
        summaryText += ` exploring ${destinationCount} destination${destinationCount > 1 ? 's' : ''}`;
        if (destinationCount <= 3) {
            summaryText += `: ${destinationList.join(', ')}`;
        }
    }
    summaryText += '.\n\n';

    if (totalExpenses > 0) {
        summaryText += `Total spending reached ${formatCurrency(totalExpenses)} with an average of ${formatCurrency(avgDailySpend)} per day. Most expenses went towards ${topCategory}.\n\n`;
    }

    if (photoCount > 0) {
        summaryText += `Captured ${photoCount} unforgettable moment${photoCount > 1 ? 's' : ''} throughout the journey.\n\n`;
    }

    // Highlights from itinerary and notes
    if (itinerary || notes) {
        summaryText += '**Highlights:**\n';
        const textToAnalyze = (itinerary || '') + ' ' + (notes || '');
        const lines = textToAnalyze.split('\n').filter(line => line.trim());
        const highlights = lines.slice(0, 3).map(line => `• ${line.trim()}`).join('\n');
        summaryText += highlights;
    }

    return {
        text: summaryText,
        stats: {
            duration: `${duration} Days`,
            destinations: destinationCount,
            totalSpent: formatCurrency(totalExpenses),
            photos: photoCount,
            topCategory: topCategory.charAt(0).toUpperCase() + topCategory.slice(1),
            avgDaily: formatCurrency(avgDailySpend)
        }
    };
}

/**
 * Export trip to PDF
 */
async function exportToPDF(tripData, summaryData) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let yPos = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - 2 * margin;

        // Title
        doc.setFontSize(24);
        doc.setTextColor(102, 126, 234);
        doc.text(tripData.name, margin, yPos);
        yPos += 15;

        // Date range
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`${formatDate(tripData.startDate)} - ${formatDate(tripData.endDate)}`, margin, yPos);
        yPos += 15;

        // Destinations
        if (tripData.destinations) {
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Destinations:', margin, yPos);
            yPos += 8;
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            const destLines = doc.splitTextToSize(tripData.destinations, maxWidth);
            doc.text(destLines, margin, yPos);
            yPos += destLines.length * 6 + 10;
        }

        // Summary
        if (summaryData && summaryData.text) {
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Trip Summary:', margin, yPos);
            yPos += 8;
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            const summaryLines = doc.splitTextToSize(summaryData.text.replace(/\*\*/g, ''), maxWidth);
            doc.text(summaryLines, margin, yPos);
            yPos += summaryLines.length * 5 + 10;
        }

        // Statistics
        if (summaryData && summaryData.stats) {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Statistics:', margin, yPos);
            yPos += 10;
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);

            const stats = summaryData.stats;
            doc.text(`Duration: ${stats.duration}`, margin, yPos);
            yPos += 7;
            doc.text(`Destinations: ${stats.destinations}`, margin, yPos);
            yPos += 7;
            doc.text(`Total Spent: ${stats.totalSpent}`, margin, yPos);
            yPos += 7;
            doc.text(`Photos: ${stats.photos}`, margin, yPos);
            yPos += 15;
        }

        // Expenses
        if (tripData.expenses && tripData.expenses.length > 0) {
            if (yPos > 200) {
                doc.addPage();
                yPos = 20;
            }
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Expenses:', margin, yPos);
            yPos += 10;
            doc.setFontSize(10);

            tripData.expenses.forEach(exp => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(`${exp.description}: ${formatCurrency(exp.amount)} (${exp.category})`, margin, yPos);
                yPos += 6;
            });
        }

        // Save PDF
        doc.save(`${tripData.name.replace(/[^a-z0-9]/gi, '_')}_TravelLog.pdf`);
        showToast('PDF exported successfully!', 'success');
    } catch (error) {
        console.error('PDF export error:', error);
        showToast('Error exporting PDF', 'error');
    }
}

/**
 * Generate shareable link
 */
function generateShareableLink(tripData) {
    const encoded = btoa(JSON.stringify(tripData));
    const url = `${window.location.origin}${window.location.pathname}?trip=${encoded}`;
    return url;
}

/**
 * Load trip from URL
 */
function loadTripFromURL() {
    const params = new URLSearchParams(window.location.search);
    const tripData = params.get('trip');
    if (tripData) {
        try {
            return JSON.parse(atob(tripData));
        } catch (e) {
            console.error('Error loading trip from URL:', e);
        }
    }
    return null;
}
