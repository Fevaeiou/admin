document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.dropdown-active').forEach(item => {
                if (item !== this.parentElement) {
                    item.classList.remove('dropdown-active');
                    item.querySelector('.dropdown-menu').style.maxHeight = null;
                }
            });

            this.parentElement.classList.toggle('dropdown-active');
            
            const dropdownMenu = this.nextElementSibling;
            if (dropdownMenu.style.maxHeight) {
                dropdownMenu.style.maxHeight = null;
            } else {
                dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
            }
        });
    });

    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebarToggle.addEventListener('click', function() {
        document.body.classList.toggle('sidebar-collapsed');

        if (document.body.classList.contains('sidebar-collapsed')) {
            document.cookie = "sidebarCollapsed=true; path=/; max-age=2592000"; 
        } else {
            document.cookie = "sidebarCollapsed=false; path=/; max-age=2592000";
        }
    });

    function checkSidebarState() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'sidebarCollapsed' && value === 'true') {
                document.body.classList.add('sidebar-collapsed');
                break;
            }
        }

        if (window.innerWidth <= 768) {
            document.body.classList.add('sidebar-collapsed');
        }
    }
    
    checkSidebarState();

    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            document.body.classList.add('sidebar-collapsed');
        }
    });
});