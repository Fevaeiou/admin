document.addEventListener('DOMContentLoaded', function() {
    const NotificationSystem = {
        init: function() {
            this.bindEvents();
            this.setupTabSystem();
            this.setupMarkAllAsRead();
            this.setupFilterSystem();
            this.setupPagination();
            this.initNotificationIds();
            
            DateUtils.setupDateTimeUpdates();
            
            console.log('Notification system initialized');
        },

        bindEvents: function() {
            document.querySelectorAll('.btn-mark').forEach(button => {
                button.addEventListener('click', this.markAsRead.bind(this));
            });

            document.querySelectorAll('.btn-view').forEach(button => {
                button.addEventListener('click', this.viewNotification);
            });
        },

        setupTabSystem: function() {
            const tabButtons = document.querySelectorAll('.tab-btn');
            const notificationItems = document.querySelectorAll('.notification-item');

            tabButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    e.currentTarget.classList.add('active');

                    const tabType = e.currentTarget.dataset.tab;

                    notificationItems.forEach(item => {
                        if (tabType === 'all') {
                            item.style.display = 'flex';
                        } else if (tabType === 'unread' && item.classList.contains('unread')) {
                            item.style.display = 'flex';
                        } else if (tabType === 'important' && item.classList.contains('important')) {
                            item.style.display = 'flex';
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    const url = new URL(window.location.href);
                    url.searchParams.set('tab', tabType);
                    window.history.pushState({}, '', url);
                });
            });

            const urlParams = new URLSearchParams(window.location.search);
            const activeTab = urlParams.get('tab');
            if (activeTab) {
                const targetTab = document.querySelector(`.tab-btn[data-tab="${activeTab}"]`);
                if (targetTab) {
                    targetTab.click();
                }
            }
        },

        setupFilterSystem: function() {
            const filterSelect = document.querySelector('.notification-filter select');
            const notificationItems = document.querySelectorAll('.notification-item');

            filterSelect.addEventListener('change', (e) => {
                const filterValue = e.target.value;
                
                notificationItems.forEach(item => {
                    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
                    let showBasedOnTab = true;
                    
                    if (activeTab === 'unread' && !item.classList.contains('unread')) {
                        showBasedOnTab = false;
                    } else if (activeTab === 'important' && !item.classList.contains('important')) {
                        showBasedOnTab = false;
                    }
                    
                    if (filterValue === 'all' && showBasedOnTab) {
                        item.style.display = 'flex';
                    } else if (showBasedOnTab) {
                        const notificationIcon = item.querySelector('.notification-icon');
                        if (
                            (filterValue === 'donations' && notificationIcon.classList.contains('donation')) ||
                            (filterValue === 'volunteers' && notificationIcon.classList.contains('volunteer')) ||
                            (filterValue === 'system' && notificationIcon.classList.contains('system')) ||
                            (filterValue === 'unread' && item.classList.contains('unread'))
                        ) {
                            item.style.display = 'flex';
                        } else {
                            item.style.display = 'none';
                        }
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        },

        setupMarkAllAsRead: function() {
            const markAllBtn = document.querySelector('.btn-mark-all');
            
            markAllBtn.addEventListener('click', () => {
                const unreadItems = document.querySelectorAll('.notification-item.unread');
                
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                });
                
                document.querySelectorAll('.badge').forEach(badge => {
                    badge.textContent = '0';
                });
                
                this.showNotificationAlert('All notifications marked as read', 'success');
                
                this.updateUnreadCountOnServer(0);
            });
        },

        markAsRead: function(e) {
            const notificationItem = e.currentTarget.closest('.notification-item');
            const notificationId = notificationItem.dataset.id;
            
            if (notificationItem.classList.contains('unread')) {
                notificationItem.classList.remove('unread');
                
                const unreadBadge = document.querySelector('.tab-btn[data-tab="unread"] .badge');
                let unreadCount = parseInt(unreadBadge.textContent) - 1;
                unreadCount = unreadCount < 0 ? 0 : unreadCount;
                unreadBadge.textContent = unreadCount;
                
                if (notificationItem.classList.contains('important')) {
                    const importantBadge = document.querySelector('.tab-btn[data-tab="important"] .badge');
                    const importantItems = document.querySelectorAll('.notification-item.important.unread');
                    importantBadge.textContent = importantItems.length - 1;
                }
                
                this.markAsReadOnServer(notificationId);
            }
        },

        markAsReadOnServer: function(notificationId) {
            console.log(`Marking notification ${notificationId} as read on server`);
            
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({ success: true });
                }, 300);
            });
        },

        updateUnreadCountOnServer: function(count) {
            console.log(`Updating unread count to ${count} on server`);
            
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({ success: true });
                }, 300);
            });
        },

        viewNotification: function(e) {
            const notificationItem = e.currentTarget.closest('.notification-item');
            const notificationType = notificationItem.querySelector('.notification-icon').className.split(' ')[1];
            const notificationTitle = notificationItem.querySelector('.notification-header h4').textContent;
            
            console.log(`Viewing notification: ${notificationTitle}`);
            
            switch (notificationType) {
                case 'donation':
                    window.location.href = 'donations.html?highlight=' + encodeURIComponent(notificationTitle);
                    break;
                case 'volunteer':
                    window.location.href = 'volunteers.html?highlight=' + encodeURIComponent(notificationTitle);
                    break;
                case 'message':
                    window.location.href = 'messages.html?highlight=' + encodeURIComponent(notificationTitle);
                    break;
                case 'system':
                    if (notificationTitle.includes('Inventory') || notificationTitle.includes('Resource')) {
                        window.location.href = 'inventory.html?highlight=' + encodeURIComponent(notificationTitle);
                    } else {
                        window.location.href = 'settings.html?highlight=' + encodeURIComponent(notificationTitle);
                    }
                    break;
                default:
                    window.location.href = 'dashboard.html';
            }
        },

        showLoadingState: function() {
            if (!document.querySelector('.loading-overlay')) {
                const loadingOverlay = document.createElement('div');
                loadingOverlay.className = 'loading-overlay';
                loadingOverlay.innerHTML = `
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                `;
                document.querySelector('.notifications-list').appendChild(loadingOverlay);
            } else {
                document.querySelector('.loading-overlay').style.display = 'flex';
            }
        },

        hideLoadingState: function() {
            const loadingOverlay = document.querySelector('.loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
        },

        showNotificationAlert: function(message, type = 'info') {
            if (!document.querySelector('.notification-alert-container')) {
                const alertContainer = document.createElement('div');
                alertContainer.className = 'notification-alert-container';
                document.body.appendChild(alertContainer);
            }
            
            const alertContainer = document.querySelector('.notification-alert-container');
            
            const alert = document.createElement('div');
            alert.className = `notification-alert ${type}`;
            alert.innerHTML = `
                <span>${message}</span>
                <button class="close-alert"><i class="fas fa-times"></i></button>
            `;
            
            alertContainer.appendChild(alert);
            
            if (!document.getElementById('alert-styles')) {
                const style = document.createElement('style');
                style.id = 'alert-styles';
                style.textContent = `
                    .notification-alert-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 9999;
                        max-width: 350px;
                    }
                    
                    .notification-alert {
                        background-color: white;
                        border-radius: 5px;
                        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                        margin-bottom: 10px;
                        padding: 15px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        animation: slideIn 0.3s ease forwards;
                        border-left: 4px solid #888;
                    }
                    
                    .notification-alert.success {
                        border-left-color: #1cc88a;
                    }
                    
                    .notification-alert.info {
                        border-left-color: #4e73df;
                    }
                    
                    .notification-alert.warning {
                        border-left-color: #f6c23e;
                    }
                    
                    .notification-alert.error {
                        border-left-color: #e74a3b;
                    }
                    
                    .notification-alert .close-alert {
                        background: none;
                        border: none;
                        cursor: pointer;
                        color: #888;
                    }
                    
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateX(100px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes slideOut {
                        from {
                            opacity: 1;
                            transform: translateX(0);
                        }
                        to {
                            opacity: 0;
                            transform: translateX(100px);
                        }
                    }
                    
                    .notification-alert.closing {
                        animation: slideOut 0.3s ease forwards;
                    }
                    
                    .loading-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(255, 255, 255, 0.7);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 5;
                    }
                    
                    .loading-spinner {
                        font-size: 2rem;
                        color: var(--primary-color);
                    }
                `;
                document.head.appendChild(style);
            }
            
            alert.querySelector('.close-alert').addEventListener('click', () => {
                alert.classList.add('closing');
                setTimeout(() => {
                    if (alertContainer.contains(alert)) {
                        alertContainer.removeChild(alert);
                    }
                }, 300);
            });
            
            setTimeout(() => {
                if (alertContainer.contains(alert)) {
                    alert.classList.add('closing');
                    setTimeout(() => {
                        if (alertContainer.contains(alert)) {
                            alertContainer.removeChild(alert);
                        }
                    }, 300);
                }
            }, 5000);
        },

        initNotificationIds: function() {
            document.querySelectorAll('.notification-item').forEach((item, index) => {
                if (!item.dataset.id) {
                    item.dataset.id = `notification-${index + 1}`;
                }
            });
        }
    };

    const DateUtils = {
        formatRelativeTime: function(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffInMilliseconds = now - date;
            const diffInSeconds = diffInMilliseconds / 1000;
            const diffInMinutes = diffInSeconds / 60;
            const diffInHours = diffInMinutes / 60;
            const diffInDays = diffInHours / 24;
            
            if (diffInMinutes < 1) {
                return 'just now';
            } else if (diffInMinutes < 60) {
                const minutes = Math.floor(diffInMinutes);
                return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
            } else if (diffInHours < 24) {
                const hours = Math.floor(diffInHours);
                return `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else if (diffInDays < 2) {
                return 'yesterday';
            } else if (diffInDays < 7) {
                const days = Math.floor(diffInDays);
                return `${days} days ago`;
            } else {
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return date.toLocaleDateString('en-US', options);
            }
        },
        
        parseTimeString: function(timeText) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (timeText.includes('hour') || timeText.includes('minute') || timeText === 'just now') {
                const hours = timeText.match(/(\d+) hour/);
                const minutes = timeText.match(/(\d+) minute/);
                const date = new Date(now);
                
                if (hours) {
                    date.setHours(date.getHours() - parseInt(hours[1]));
                }
                if (minutes) {
                    date.setMinutes(date.getMinutes() - parseInt(minutes[1]));
                }
                if (timeText === 'just now') {
                }
                
                return date.toISOString();
            } else if (timeText === 'yesterday') {
                const date = new Date(yesterday);
                return date.toISOString();
            } else if (timeText.match(/\d{1,2}:\d{2} (AM|PM)/)) {
                const [time, period] = timeText.split(' ');
                const [hours, minutes] = time.split(':').map(Number);
                
                const date = new Date(today);
                date.setHours(period === 'PM' && hours < 12 ? hours + 12 : hours);
                date.setMinutes(minutes);
                
                return date.toISOString();
            } else {
                try {
                    const date = new Date(timeText);
                    if (!isNaN(date.getTime())) {
                        return date.toISOString();
                    }
                } catch (e) {
                    console.warn('Could not parse time string:', timeText);
                }
                
                return now.toISOString();
            }
        },
        
        setupDateTimeUpdates: function() {
            document.querySelectorAll('.notification-time').forEach(timeElement => {
                const timeText = timeElement.textContent.trim();
                
                if (!timeElement.dataset.timestamp) {
                    if (timeText.includes(', ')) {
                        const [day, time] = timeText.split(', ');
                        
                        if (day === 'Yesterday') {
                            const yesterday = new Date();
                            yesterday.setDate(yesterday.getDate() - 1);
                            
                            const [hourMinute, period] = time.split(' ');
                            const [hour, minute] = hourMinute.split(':').map(Number);
                            
                            yesterday.setHours(period === 'PM' && hour < 12 ? hour + 12 : hour);
                            yesterday.setMinutes(minute);
                            yesterday.setSeconds(0);
                            
                            timeElement.dataset.timestamp = yesterday.toISOString();
                        } else if (day === 'Today') {
                            const today = new Date();
                            
                            const [hourMinute, period] = time.split(' ');
                            const [hour, minute] = hourMinute.split(':').map(Number);
                            
                            today.setHours(period === 'PM' && hour < 12 ? hour + 12 : hour);
                            today.setMinutes(minute);
                            today.setSeconds(0);
                            
                            timeElement.dataset.timestamp = today.toISOString();
                        } else {
                            const parsedDate = new Date(timeText);
                            if (!isNaN(parsedDate.getTime())) {
                                timeElement.dataset.timestamp = parsedDate.toISOString();
                            } else {
                                console.warn('Could not parse date:', timeText);
                                timeElement.dataset.timestamp = new Date().toISOString();
                            }
                        }
                    } else {
                        timeElement.dataset.timestamp = this.parseTimeString(timeText);
                    }
                }
            });
            
            this.updateTimeDisplays();
            
            setInterval(() => {
                this.updateTimeDisplays();
            }, 60000);
        },
        
        updateTimeDisplays: function() {
            document.querySelectorAll('.notification-time').forEach(timeElement => {
                if (timeElement.dataset.timestamp) {
                    timeElement.textContent = this.formatRelativeTime(timeElement.dataset.timestamp);
                }
            });
        }
    };

    const NotificationManager = {
        init: function() {
            this.setupNotificationCounter();
        },
        
        setupNotificationCounter: function() {
            const unreadCount = document.querySelectorAll('.notification-item.unread').length;
            const importantUnreadCount = document.querySelectorAll('.notification-item.unread.important').length;
            
            document.querySelectorAll('.tab-btn[data-tab="unread"] .badge').forEach(badge => {
                badge.textContent = unreadCount;
            });
            
            document.querySelectorAll('.tab-btn[data-tab="important"] .badge').forEach(badge => {
                badge.textContent = importantUnreadCount;
            });
        }
    };

    NotificationSystem.init();
    NotificationManager.init();
});