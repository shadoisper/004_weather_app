const API_KEY = '50f9408ce95d1b91818b8a8e12594cff';  // OpenWeatherMap API key

// Time and Date Functionality
function updateDateTime() {
    const now = new Date();
    const dateTimeElement = document.getElementById('currentDate');
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Add leading zeros
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
    const dateString = `${day}, ${date} ${month} ${year}`;
    
    dateTimeElement.innerHTML = `
        <span class="time">${timeString}</span>
        <span class="date">${dateString}</span>
    `;
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('weatherAppTheme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'light';

    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('weatherAppTheme', newTheme);
    });
}

function searchWeather() {
    const cityInput = document.getElementById('cityInput');
    const cityName = document.getElementById('cityName');
    const currentDate = document.getElementById('currentDate');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const pressure = document.getElementById('pressure');
    const visibility = document.getElementById('visibility');
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherResult = document.getElementById('weatherResult');

    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    // Remove any existing script tag
    const oldScript = document.getElementById('weather-script');
    if (oldScript) {
        oldScript.remove();
    }

    // Create a new script element for JSONP request
    const script = document.createElement('script');
    script.id = 'weather-script';
    script.src = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&callback=handleWeatherResponse`;
    document.body.appendChild(script);

    // Error handling for script loading
    script.onerror = function() {
        alert('Failed to fetch weather data. Please check your internet connection.');
    };
}

// Global callback function to handle the JSONP response
function handleWeatherResponse(data) {
    try {
        console.log('Received Weather Data:', data);

        if (data.cod !== 200) {
            alert(`Error: ${data.message}`);
            return;
        }

        const cityName = document.getElementById('cityName');
        const temperature = document.getElementById('temperature');
        const description = document.getElementById('description');
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('windSpeed');
        const pressure = document.getElementById('pressure');
        const visibility = document.getElementById('visibility');
        const weatherIcon = document.getElementById('weatherIcon');
        const weatherResult = document.getElementById('weatherResult');

        // Set weather details
        cityName.textContent = data.name;
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        description.textContent = data.weather[0].description;
        humidity.textContent = `${data.main.humidity}%`;
        windSpeed.textContent = `${data.wind.speed} m/s`;
        pressure.textContent = `${data.main.pressure} hPa`;
        visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

        // Set dynamic weather icon
        const weatherCondition = data.weather[0].main.toLowerCase();
        weatherIcon.className = 'fas';  // Reset classes
        
        // Map weather conditions to Font Awesome icons
        const iconMap = {
            'clear': 'fa-sun',
            'clouds': 'fa-cloud',
            'rain': 'fa-cloud-rain',
            'drizzle': 'fa-cloud-sun-rain',
            'thunderstorm': 'fa-bolt',
            'snow': 'fa-snowflake',
            'mist': 'fa-smog'
        };

        weatherIcon.classList.add(iconMap[weatherCondition] || 'fa-cloud');

        weatherResult.style.display = 'block';
    } catch (error) {
        console.error('Error processing weather data:', error);
        alert('Failed to process weather data');
    }
}

// Event listener for Enter key
document.getElementById('cityInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
});

// Add network status event listeners for debugging
window.addEventListener('online', () => {
    console.log('Network connection restored');
});

window.addEventListener('offline', () => {
    console.log('Network connection lost');
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    
    // Update time immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
});
