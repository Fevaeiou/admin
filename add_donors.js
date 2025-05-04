const donorForm = document.getElementById('donor-form');
const donorTypeSelect = document.getElementById('donor-type');
const individualFields = document.getElementById('individual-fields');
const orgFields = document.getElementById('org-fields');
const cancelBtn = document.querySelector('.btn-cancel');
const saveBtn = document.querySelector('.btn-save');
const fileInput = document.getElementById('donor-image');
const fileInputBtn = document.querySelector('.btn-file-input');
const fileName = document.querySelector('.file-name');

document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
});

function initEventListeners() {
    donorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveDonor();
    });

    donorTypeSelect.addEventListener('change', toggleDonorFields);

    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            window.location.href = 'donors.html';
        }
    });

    fileInputBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            fileName.textContent = this.files[0].name;
        } else {
            fileName.textContent = 'No file chosen';
        }
    });
}

function toggleDonorFields() {
    const selectedDonorType = donorTypeSelect.value;

    if (selectedDonorType === 'individual') {
        individualFields.style.display = 'block';
        orgFields.style.display = 'none';
        document.getElementById('first-name').setAttribute('required', '');
        document.getElementById('last-name').setAttribute('required', '');
        document.getElementById('org-name').removeAttribute('required');
    } else {
        individualFields.style.display = 'none';
        orgFields.style.display = 'block';
        document.getElementById('org-name').setAttribute('required', '');
        document.getElementById('first-name').removeAttribute('required');
        document.getElementById('last-name').removeAttribute('required');
    }
}

function saveDonor() {
    const requiredFields = donorForm.querySelectorAll('[required]');
    let isValid = true;

    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            field.parentNode.appendChild(errorMsg);
        }
    });

    const emailField = document.getElementById('email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        isValid = false;
        emailField.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Please enter a valid email address';
        emailField.parentNode.appendChild(errorMsg);
    }

    if (!isValid) {
        showNotification('Please correct the errors in the form', 'error');
        return;
    }

    const formData = new FormData(donorForm);
    const donorData = {};

    for (const [key, value] of formData.entries()) {
        donorData[key] = value;
    }

    if (donorTypeSelect.value === 'individual') {
        donorData.name = document.getElementById('first-name').value + ' ' + document.getElementById('last-name').value;
    } else {
        donorData.name = document.getElementById('org-name').value;
    }

    if (fileInput.files.length > 0) {
        donorData.hasImage = true;
        donorData.imageName = fileInput.files[0].name;
    }

    console.log('Saving donor data:', donorData);

    showNotification('Processing...', 'info');

    setTimeout(() => {
        showNotification('Donor successfully saved!', 'success');
        setTimeout(() => {
            window.location.href = 'donors.html';
        }, 1500);
    }, 1000);
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showNotification(message, type = 'info') {
    let notifContainer = document.querySelector('.notification-container');

    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.className = 'notification-container';
        document.body.appendChild(notifContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    notification.appendChild(messageSpan);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => removeNotification(notification));
    notification.appendChild(closeBtn);

    notifContainer.appendChild(notification);

    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    notification.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
        notification.remove();
    }, 300);
}