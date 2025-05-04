document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));

    if (!eventId) {
        alert('No event ID specified');
        window.location.href = 'events.html';
        return;
    }

    const events = JSON.parse(localStorage.getItem('virsproutEvents')) || [];
    const event = events.find(e => e.id === eventId);

    if (!event) {
        alert('Event not found');
        window.location.href = 'events.html';
        return;
    }

    document.getElementById('event-title').value = event.title;
    document.getElementById('event-type').value = event.type;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventTime').value = event.startTime;
    document.getElementById('eventEndTime').value = event.endTime || '';
    document.getElementById('event-location').value = event.location;
    document.getElementById('event-description').value = event.description;
    document.getElementById('event-capacity').value = event.capacity !== 'Unlimited' ? event.capacity : '';
    document.getElementById('event-organizer').value = event.organizer || '';
    document.getElementById('event-status').value = event.status;

    document.getElementById('btn-update-event').addEventListener('click', function(e) {
        e.preventDefault();
        updateEvent(eventId);
    });

    document.getElementById('btn-cancel').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'events.html';
    });
});

function updateEvent(eventId) {
    const title = document.getElementById('event-title').value;
    const type = document.getElementById('event-type').value;
    const date = document.getElementById('eventDate').value;
    const startTime = document.getElementById('eventTime').value;
    const endTime = document.getElementById('eventEndTime').value;
    const location = document.getElementById('event-location').value;
    const description = document.getElementById('event-description').value;
    const capacity = document.getElementById('event-capacity').value;
    const organizer = document.getElementById('event-organizer').value;
    const status = document.getElementById('event-status').value;

    if (!title || !type || !date || !startTime || !location || !description) {
        alert('Please fill in all required fields.');
        return;
    }

    const eventDate = new Date(date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleString('default', { month: 'short' });

    let events = JSON.parse(localStorage.getItem('virsproutEvents')) || [];
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
        alert('Event not found');
        return;
    }

    events[eventIndex] = {
        ...events[eventIndex],
        title: title,
        type: type,
        date: date,
        day: day,
        month: month,
        startTime: startTime,
        endTime: endTime,
        location: location,
        description: description,
        capacity: capacity || 'Unlimited',
        organizer: organizer || 'VirSprout Team',
        status: status,
        updatedAt: new Date().toISOString()
    };

    localStorage.setItem('virsproutEvents', JSON.stringify(events));
    alert('Event updated successfully!');
    window.location.href = 'events.html';
}