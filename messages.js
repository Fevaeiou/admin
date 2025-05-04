document.addEventListener('DOMContentLoaded', function() {
    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            messageItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            if (this.classList.contains('unread')) {
                this.classList.remove('unread');
                const unreadIndicator = this.querySelector('.unread-indicator');
                if (unreadIndicator) {
                    unreadIndicator.remove();
                }
            }
        });
    });

    const starButtons = document.querySelectorAll('.btn-star');
    starButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('starred');
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });

    const messageFilter = document.querySelector('.message-filter select');
    if (messageFilter) {
        messageFilter.addEventListener('change', function() {
            const filterValue = this.value;
            messageItems.forEach(item => {
                item.style.display = 'flex';
            });
            if (filterValue !== 'all') {
                messageItems.forEach(item => {
                    if (!item.classList.contains(filterValue)) {
                        item.style.display = 'none';
                    }
                });
            }
        });
    }

    const composeButton = document.querySelector('.btn-compose');
    if (composeButton) {
        composeButton.addEventListener('click', function() {
            alert('Compose new message functionality would open here');
        });
    }

    const actionButtons = document.querySelectorAll('.message-actions .btn-action');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-tooltip');
            switch(action) {
                case 'Archive':
                    alert('Message would be archived');
                    break;
                case 'Delete':
                    if (confirm('Are you sure you want to delete this message?')) {
                        alert('Message would be deleted');
                    }
                    break;
                case 'Mark as Unread':
                    alert('Message would be marked as unread');
                    break;
                case 'Flag':
                    this.querySelector('i').style.color = this.querySelector('i').style.color === 'red' ? '' : 'red';
                    break;
            }
        });
    });

    const replyBox = document.querySelector('.reply-box textarea');
    const sendButton = document.querySelector('.btn-send');
    const saveDraftButton = document.querySelector('.btn-save-draft');

    if (sendButton) {
        sendButton.addEventListener('click', function() {
            const replyText = replyBox.value.trim();
            if (replyText) {
                alert('Your reply would be sent');
                replyBox.value = '';
            } else {
                alert('Please enter a reply message');
            }
        });
    }

    if (saveDraftButton) {
        saveDraftButton.addEventListener('click', function() {
            const replyText = replyBox.value.trim();
            if (replyText) {
                alert('Your draft has been saved');
            } else {
                alert('Nothing to save');
            }
        });
    }

    const formattingButtons = document.querySelectorAll('.formatting-tools button');
    formattingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const formattingType = this.querySelector('i').className;
            let formatAction = '';
            if (formattingType.includes('bold')) {
                formatAction = 'Bold';
            } else if (formattingType.includes('italic')) {
                formatAction = 'Italic';
            } else if (formattingType.includes('list')) {
                formatAction = 'List';
            } else if (formattingType.includes('paperclip')) {
                formatAction = 'Attach file';
            }
            alert(`${formatAction} formatting would be applied`);
        });
    });

    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length > 0) {
                messageItems.forEach(item => {
                    const senderName = item.querySelector('h4').textContent.toLowerCase();
                    const previewText = item.querySelector('p').textContent.toLowerCase();
                    if (senderName.includes(searchTerm) || previewText.includes(searchTerm)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            } else {
                messageItems.forEach(item => {
                    item.style.display = 'flex';
                });
                if (messageFilter && messageFilter.value !== 'all') {
                    const filterValue = messageFilter.value;
                    messageItems.forEach(item => {
                        if (!item.classList.contains(filterValue)) {
                            item.style.display = 'none';
                        }
                    });
                }
            }
        });
    }

    const collapseButton = document.querySelector('.btn-collapse');
    const messageBody = document.querySelector('.message-body');

    if (collapseButton && messageBody) {
        collapseButton.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-chevron-down')) {
                messageBody.style.display = 'none';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                messageBody.style.display = 'block';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    }

    if (replyBox) {
        replyBox.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                if (sendButton) {
                    sendButton.click();
                }
            }
        });
    }

    updateMessageCounters();
});

function updateMessageCounters() {
    const unreadMessages = document.querySelectorAll('.message-item.unread').length;
    const totalMessages = document.querySelectorAll('.message-item').length;
    console.log(`Unread messages: ${unreadMessages}`);
    console.log(`Total messages: ${totalMessages}`);
    if (unreadMessages > 0) {
        document.title = `(${unreadMessages}) Sprout ADMIN | MESSAGES`;
    } else {
        document.title = 'Sprout ADMIN | MESSAGES';
    }
}

function logoutUser() {
    if (confirm('Are you sure you want to log out?')) {
        alert('You have been logged out successfully.');
    }
}