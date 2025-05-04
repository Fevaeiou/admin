document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
});

function loadEvents() {
    const events = JSON.parse(localStorage.getItem('virsproutEvents')) || [];
    const eventsList = document.getElementById('events-list');

    if (events.length === 0) {
        eventsList.innerHTML = '<p class="no-events">No events found.';
        return;
    }

    eventsList.innerHTML = '';
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    events.forEach(event => {
        const eventCard = createEventCard(event);
        eventsList.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';

    let imageUrl = 'default-event.jpg';
    if (event.type.toLowerCase().includes('community')) {
        imageUrl = 'community-event.jpg';
    } else if (event.type.toLowerCase().includes('fundraising')) {
        imageUrl = 'fundraising-event.jpg';
    } else if (event.type.toLowerCase().includes('volunteering')) {
        imageUrl = 'volunteering-event.jpg';
    }

    const typeClass = event.type.toLowerCase().replace(/\s+/g, '');
    const eventDate = new Date(event.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' });

    eventCard.innerHTML = `
        <div class="event-image">
            <img src="${imageUrl}" alt="${event.title}" onerror="this.src='placeholder.jpg'">
            <div class="event-date">
                <span class="date-day">${day}</span>
                <span class="date-month">${month}</span>
            </div>
            <div class="event-badge ${typeClass}">${event.type}</div>
        </div>
        <div class="event-details">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-meta">
                <span><i class="far fa-clock"></i> ${event.startTime} - ${event.endTime}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                <span><i class="fas fa-user-friends"></i> Capacity: ${event.capacity}</span>
                <span><i class="fas fa-user"></i> By: ${event.organizer}</span>
            </div>
            <p class="event-description">${truncateText(event.description, 150)}</p>
            <div class="event-actions">
                <a href="edit_events.html?id=${event.id}" class="btn-event-update"><i class="fas fa-edit"></i> Edit</a>
                <button class="btn-event-delete" onclick="deleteEvent(${event.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `;

    return eventCard;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function deleteEvent(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    let events = JSON.parse(localStorage.getItem('virsproutEvents')) || [];
    events = events.filter(event => event.id !== eventId);
    localStorage.setItem('virsproutEvents', JSON.stringify(events));
    loadEvents();
}