document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    initializeDropdowns();

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            const dropdownMenu = this.nextElementSibling;
            parent.classList.toggle('dropdown-active');
            if (parent.classList.contains('dropdown-active')) {
                dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
            } else {
                dropdownMenu.style.maxHeight = "0px";
            }
        });
    });

    function initializeDropdowns() {
        const allDropdownMenus = document.querySelectorAll('.dropdown-menu');
        allDropdownMenus.forEach(menu => {
            menu.style.maxHeight = "0px";
        });

        const activeMenuItems = document.querySelectorAll('.dropdown-menu .active');
        activeMenuItems.forEach(item => {
            const parentDropdown = item.closest('li').parentElement.parentElement;
            if (parentDropdown.classList.contains('dropdown-toggle')) {
                const dropdownParent = parentDropdown.parentElement;
                const dropdownMenu = item.closest('.dropdown-menu');
                dropdownParent.classList.add('dropdown-active');
                dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
            }
        });

        const activeDropdownParents = document.querySelectorAll('.menu > ul > li.active');
        activeDropdownParents.forEach(parent => {
            if (parent.querySelector('.dropdown-menu')) {
                const dropdownMenu = parent.querySelector('.dropdown-menu');
                parent.classList.add('dropdown-active');
                dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + "px";
            }
        });
    }
});