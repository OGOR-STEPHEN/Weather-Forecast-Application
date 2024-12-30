// Handle Save Settings
document.getElementById('Save').addEventListener('click', () => {
    const unit = document.getElementById('unit-toggle').value;
    const theme = document.getElementById('theme-toggle').value;
    const defaultLocation = document.getElementById('default-location').value.trim();

    if (!defaultLocation) {
        alert('Please enter a default location.');
        return;
    }

    // Save settings to localStorage
    localStorage.setItem('unit', unit);
    localStorage.setItem('theme', theme);
    localStorage.setItem('defaultLocation', defaultLocation);

    alert('Settings saved successfully!');
});

// Apply theme dynamically
document.getElementById('theme-toggle').addEventListener('change', () => {
    const theme = document.getElementById('theme-toggle').value;
    document.body.classList.toggle('dark-theme', theme === 'dark');
});

// Apply theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', theme === 'dark');
});

// Handle Back Button
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to the main page
});

// Load Settings on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const savedUnit = localStorage.getItem('unit') || 'celsius';
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLocation = localStorage.getItem('defaultLocation') || '';

    document.getElementById('unit-toggle').value = savedUnit;
    document.getElementById('theme-toggle').value = savedTheme;
    document.getElementById('default-location').value = savedLocation;
});
