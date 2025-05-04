const donorModal = document.getElementById('donor-modal');
const addDonorBtn = document.querySelector('.btn-add-donor');
const modalCloseBtn = document.querySelector('.modal-close');
const cancelBtn = document.querySelector('.btn-cancel');
const saveBtn = document.querySelector('.btn-save');
const donorForm = document.getElementById('donor-form');
const applyBulkBtn = document.querySelector('.btn-apply');
const searchInput = document.querySelector('.search-bar input');

document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    initTableActions();
});

function initEventListeners() {
    addDonorBtn.addEventListener('click', openModal);
    modalCloseBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', saveDonor);
    donorTypeSelect.addEventListener('change', toggleDonorFields);
    selectAllCheckbox.addEventListener('change', toggleAllCheckboxes);
    applyBulkBtn.addEventListener('click', applyBulkAction);
    filterBtn.addEventListener('click', applyFilters);
    resetBtn.addEventListener('click', resetFilters);
    searchInput.addEventListener('input', searchDonors);
    setupActionButtons();
}

function openModal() {
    donorModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    donorModal.classList.remove('active');
    document.body.style.overflow = '';
    donorForm.reset();
    individualFields.style.display = 'block';
    orgFields.style.display = 'none';
}

function toggleDonorFields() {
    const selectedDonorType = donorTypeSelect.value;
    if (selectedDonorType === 'individual') {
        individualFields.style.display = 'block';
        orgFields.style.display = 'none';
    } else {
        individualFields.style.display = 'none';
        orgFields.style.display = 'block';
    }
}

function saveDonor() {
    const requiredFields = donorForm.querySelectorAll('[required]');
    let isValid = true;
    requiredFields.forEach(field => {
        if (!field.value) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    if (!isValid) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    showNotification('Donor successfully saved!', 'success');
    closeModal();
}

function toggleAllCheckboxes() {
    donorCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

function applyBulkAction() {
    const selectedAction = bulkActionSelect.value;
    if (!selectedAction) {
        showNotification('Please select an action', 'warning');
        return;
    }
    const selectedDonors = Array.from(donorCheckboxes).filter(checkbox => checkbox.checked);
    if (selectedDonors.length === 0) {
        showNotification('Please select at least one donor', 'warning');
        return;
    }
    switch (selectedAction) {
        case 'export':
            showNotification(`Exporting ${selectedDonors.length} donors...`, 'info');
            break;
        case 'email':
            showNotification(`Preparing email for ${selectedDonors.length} donors...`, 'info');
            break;
        case 'tag':
            showNotification(`Adding tags to ${selectedDonors.length} donors...`, 'info');
            break;
        case 'delete':
            if (confirm(`Are you sure you want to delete ${selectedDonors.length} donors? This action cannot be undone.`)) {
                showNotification(`${selectedDonors.length} donors deleted successfully`, 'success');
            }
            break;
    }
    bulkActionSelect.value = '';
    selectAllCheckbox.checked = false;
    donorCheckboxes.forEach(checkbox => checkbox.checked = false);
}

function applyFilters() {
    const donorType = document.getElementById('donor-type-filter').value;
    const frequency = document.getElementById('frequency-filter').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        showNotification('Start date cannot be after end date', 'error');
        return;
    }
    showNotification('Filters applied successfully', 'success');
}

function resetFilters() {
    document.getElementById('donor-type-filter').value = 'all';
    document.getElementById('frequency-filter').value = 'all';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    showNotification('Filters have been reset', 'info');
}

function searchDonors() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm.length > 2) {
        debounce(() => {
            showNotification(`Searching for: ${searchTerm}`, 'info');
        }, 500)();
    }
}

function setupActionButtons() {
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const donorName = this.closest('tr').querySelector('.donor-name').textContent;
            showNotification(`Viewing details for ${donorName}`, 'info');
        });
    });
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const donorName = this.closest('tr').querySelector('.donor-name').textContent;
            showNotification(`Editing ${donorName}`, 'info');
            openModal();
        });
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const donorName = this.closest('tr').querySelector('.donor-name').textContent;
            if (confirm(`Are you sure you want to delete ${donorName}? This action cannot be undone.`)) {
                this.closest('tr').remove();
                showNotification(`${donorName} deleted successfully`, 'success');
            }
        });
    });
}

function initTableActions() {
    document.querySelectorAll('.donors-table tbody tr').forEach(row => {
        row.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'I' || e.target.tagName === 'INPUT') {
                return;
            }
            const checkbox = this.querySelector('.donor-select');
            checkbox.checked = !checkbox.checked;
            updateSelectAllCheckbox();
        });
    });
}

function updateSelectAllCheckbox() {
    const checkedCount = document.querySelectorAll('.donor-select:checked').length;
    const totalCount = donorCheckboxes.length;
    selectAllCheckbox.checked = checkedCount > 0 && checkedCount === totalCount;
    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < totalCount;
}

function showNotification(message, type = 'info') {
    let notifContainer = document.querySelector('.notification-container');
    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.className = 'notification-container';
        document.body.appendChild(notifContainer);
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1100;
            }
            .notification {
                padding: 12px 20px;
                margin-bottom: 10px;
                border-radius: 5px;
                color: white;
                font-size: 0.9rem;
                box-shadow: 0 3px 10px rgba(0,0,0,0.15);
                display: flex;
                justify-content: space-between;
                align-items: center;
                animation: slideIn 0.3s ease-out forwards;
                max-width: 350px;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1rem;
                cursor: pointer;
                margin-left: 10px;
                opacity: 0.7;
            }
            .notification-close:hover {
                opacity: 1;
            }
            .notification.success { background-color: #4CAF50; }
            .notification.error { background-color: #F44336; }
            .notification.warning { background-color: #FFC107; color: #333; }
            .notification.info { background-color: #2196F3; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
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

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}