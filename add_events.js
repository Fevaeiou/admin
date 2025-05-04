document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-save-event').addEventListener('click', function(e) {
        e.preventDefault();
        addEvent();
    });
});

function addEvent() {
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

    const events = JSON.parse(localStorage.getItem('virsproutEvents')) || [];
    const maxId = events.length > 0 ? Math.max(...events.map(e => e.id)) : 0;
    const newId = maxId + 1;

    const newEvent = {
        id: newId,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    events.push(newEvent);
    localStorage.setItem('virsproutEvents', JSON.stringify(events));
    alert('Event added successfully!');
    
    document.getElementById('event-title').value = '';
    document.getElementById('event-type').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventEndTime').value = '';
    document.getElementById('event-location').value = '';
    document.getElementById('event-description').value = '';
    document.getElementById('event-capacity').value = '';
    document.getElementById('event-organizer').value = '';
    document.getElementById('event-status').value = 'upcoming';
    
    window.location.href = 'events.html';
}