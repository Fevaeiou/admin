document.addEventListener('DOMContentLoaded', function() {
    // Initialize the donor form data
    const urlParams = new URLSearchParams(window.location.search);
    const donorId = urlParams.get('id');
    
    if (donorId) {
        document.getElementById('donor-id').value = donorId;
        fetchDonorData(donorId);
    } else {
        showNotification('Error: No donor ID provided', 'error');
        setTimeout(() => {
            window.location.href = 'donors.html';
        }, 2000);
    }

    // Handle donor type change
    const donorTypeSelect = document.getElementById('donor-type');
    donorTypeSelect.addEventListener('change', function() {
        toggleDonorTypeFields(this.value);
    });

    // Handle image upload button
    const fileInputButton = document.querySelector('.btn-file-input');
    const fileInput = document.getElementById('donor-image');
    const fileNameDisplay = document.querySelector('.file-name');

    fileInputButton.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            fileNameDisplay.textContent = this.files[0].name;
            
            // Preview the image
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('current-donor-image').src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });

    // Handle remove image button
    const removeImageBtn = document.querySelector('.btn-remove-image');
    removeImageBtn.addEventListener('click', function() {
        document.getElementById('current-donor-image').src = 'placeholder_profile.jpg';
        fileInput.value = '';
        fileNameDisplay.textContent = 'No file chosen';
    });

    // Handle form submission
    const donorForm = document.getElementById('edit-donor-form');
    donorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            updateDonorData();
        }
    });

    // Handle cancel button
    const cancelBtn = document.querySelector('.btn-cancel');
    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            window.location.href = 'donors.html';
        }
    });

    // Handle delete donor button
    const deleteBtn = document.querySelector('.btn-delete-donor');
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this donor? This action cannot be undone.')) {
            deleteDonor(donorId);
        }
    });

    // Handle view all donations link
    document.getElementById('view-all-donations').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = `donations.html?donor=${donorId}`;
    });
});

// Toggle between individual and organization fields based on donor type
function toggleDonorTypeFields(donorType) {
    const individualFields = document.getElementById('individual-fields');
    const orgFields = document.getElementById('org-fields');
    
    if (donorType === 'individual') {
        individualFields.style.display = 'block';
        orgFields.style.display = 'none';
        
        // Make individual fields required
        document.getElementById('first-name').required = true;
        document.getElementById('last-name').required = true;
        document.getElementById('org-name').required = false;
    } else {
        individualFields.style.display = 'none';
        orgFields.style.display = 'block';
        
        // Make organization fields required
        document.getElementById('first-name').required = false;
        document.getElementById('last-name').required = false;
        document.getElementById('org-name').required = true;
    }
}

// Fetch donor data from the server
function fetchDonorData(donorId) {
    // In a real application, this would be an API call
    // For demonstration, we'll simulate the data fetch
    
    // Simulate API delay
    setTimeout(() => {
        // Mock donor data
        const donorData = {
            id: donorId,
            type: 'individual',
            status: 'active',
            firstName: 'John',
            lastName: 'Doe',
            orgName: '',
            email: 'john.doe@example.com',
            phone: '+63 917 123 4567',
            address: '123 Main St, Makati City, Metro Manila, Philippines',
            donationFrequency: 'monthly',
            firstDonationDate: '2023-01-15',
            totalDonated: '₱30,000',
            lastDonationDate: '2023-12-10',
            preferredCommunication: 'email',
            referredBy: 'Website',
            image: 'https://via.placeholder.com/150',
            notes: 'Regular donor who prefers to support education programs.',
            donationHistory: [
                { date: '2023-12-10', amount: '₱3,000', purpose: 'Education Program', paymentMethod: 'Credit Card' },
                { date: '2023-11-10', amount: '₱3,000', purpose: 'Education Program', paymentMethod: 'Credit Card' },
                { date: '2023-10-10', amount: '₱3,000', purpose: 'Education Program', paymentMethod: 'Credit Card' },
                { date: '2023-09-10', amount: '₱3,000', purpose: 'Education Program', paymentMethod: 'Credit Card' },
                { date: '2023-08-10', amount: '₱3,000', purpose: 'Education Program', paymentMethod: 'Credit Card' }
            ],
            stats: {
                donorSince: 'Jan 15, 2023',
                totalDonations: 12,
                averageDonation: '₱2,500',
                largestDonation: '₱10,000',
                engagementLevel: 'High',
                engagementPercent: 75
            }
        };

        populateForm(donorData);
    }, 500);
}

// Populate form with donor data
function populateForm(donor) {
    // Set basic info
    document.getElementById('donor-type').value = donor.type;
    document.getElementById('donor-status').value = donor.status;
    
    // Toggle fields based on donor type
    toggleDonorTypeFields(donor.type);
    
    // Set individual or organization fields
    if (donor.type === 'individual') {
        document.getElementById('first-name').value = donor.firstName;
        document.getElementById('last-name').value = donor.lastName;
    } else {
        document.getElementById('org-name').value = donor.orgName;
    }
    
    // Set contact info
    document.getElementById('email').value = donor.email;
    document.getElementById('phone').value = donor.phone;
    document.getElementById('address').value = donor.address;
    
    // Set donation info
    document.getElementById('donation-frequency').value = donor.donationFrequency;
    document.getElementById('donation-date').value = donor.firstDonationDate;
    document.getElementById('total-donated').value = donor.totalDonated;
    document.getElementById('last-donation-date').value = donor.lastDonationDate;
    document.getElementById('preferred-communication').value = donor.preferredCommunication;
    document.getElementById('referred-by').value = donor.referredBy;
    
    // Set image
    document.getElementById('current-donor-image').src = donor.image;
    
    // Set notes
    document.getElementById('notes').value = donor.notes;
    
    // Populate donation history
    const donationHistoryBody = document.getElementById('donation-history-body');
    donationHistoryBody.innerHTML = '';
    
    donor.donationHistory.forEach(donation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${donation.date}</td>
            <td>${donation.amount}</td>
            <td>${donation.purpose}</td>
            <td>${donation.paymentMethod}</td>
        `;
        donationHistoryBody.appendChild(row);
    });
    
    // Set statistics
    document.getElementById('donor-since-date').textContent = donor.stats.donorSince;
    document.getElementById('total-donations-count').textContent = donor.stats.totalDonations;
    document.getElementById('average-donation').textContent = donor.stats.averageDonation;
    document.getElementById('largest-donation').textContent = donor.stats.largestDonation;
    
    // Set engagement level
    const engagementBar = document.querySelector('.engagement-bar');
    engagementBar.style.width = `${donor.stats.engagementPercent}%`;
    document.querySelector('.engagement-label').textContent = donor.stats.engagementLevel;
    
    // Show success notification
    showNotification('Donor data loaded successfully', 'success');
}

// Validate form before submission
function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    // Remove any existing error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    
    // Remove error class from all inputs
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => input.classList.remove('error'));
    
    // Check each required field
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            field.parentNode.appendChild(errorMsg);
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
        
        // Add error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Please enter a valid email address';
        emailField.parentNode.appendChild(errorMsg);
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Update donor data on the server
function updateDonorData() {
    const donorId = document.getElementById('donor-id').value;
    
    // Gather form data
    const donorData = {
        id: donorId,
        type: document.getElementById('donor-type').value,
        status: document.getElementById('donor-status').value
    };
    
    // Add individual or organization fields based on type
    if (donorData.type === 'individual') {
        donorData.firstName = document.getElementById('first-name').value;
        donorData.lastName = document.getElementById('last-name').value;
        donorData.orgName = '';
    } else {
        donorData.firstName = '';
        donorData.lastName = '';
        donorData.orgName = document.getElementById('org-name').value;
    }
    
    // Add contact info
    donorData.email = document.getElementById('email').value;
    donorData.phone = document.getElementById('phone').value;
    donorData.address = document.getElementById('address').value;
    
    // Add donation info
    donorData.donationFrequency = document.getElementById('donation-frequency').value;
    donorData.firstDonationDate = document.getElementById('donation-date').value;
    donorData.preferredCommunication = document.getElementById('preferred-communication').value;
    donorData.referredBy = document.getElementById('referred-by').value;
    
    // Add notes
    donorData.notes = document.getElementById('notes').value;
    
    // In a real application, this would be an API call
    // For demonstration, we'll simulate the update
    
    // Show loading state
    const saveButton = document.querySelector('.btn-save');
    const originalButtonText = saveButton.textContent;
    saveButton.textContent = 'Saving...';
    saveButton.disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
        // Reset button state
        saveButton.textContent = originalButtonText;
        saveButton.disabled = false;
        
        // Show success notification
        showNotification('Donor updated successfully', 'success');
        
        // In a real app you might redirect after saving
        // window.location.href = 'donors.html';
    }, 1000);
}

// Delete donor
function deleteDonor(donorId) {
    // In a real application, this would be an API call
    // For demonstration, we'll simulate the delete
    
    // Show loading state
    const deleteButton = document.querySelector('.btn-delete-donor');
    const originalButtonText = deleteButton.textContent;
    deleteButton.textContent = 'Deleting...';
    deleteButton.disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
        // Show success notification
        showNotification('Donor deleted successfully', 'success');
        
        // Redirect to donors list
        setTimeout(() => {
            window.location.href = 'donors.html';
        }, 1000);
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    const notificationContainer = document.querySelector('.notification-container');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        ${message}
        <button class="notification-close">&times;</button>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}