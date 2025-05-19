document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const cityInput = document.getElementById('city-input');
  const searchButton = document.getElementById('search-button');
  const weatherPhrase = document.getElementById('weather-phrase');
  const weatherDetails = document.getElementById('weather-details');
  const weatherGifContainer = document.querySelector('.gif-container');
  
  // Create two image elements for light and dark mode
  const lightGifImg = document.createElement('img');
  lightGifImg.className = 'weather-gif light-mode-gif';
  lightGifImg.alt = 'Weather condition';
  weatherGifContainer.appendChild(lightGifImg);
  
  const darkGifImg = document.createElement('img');
  darkGifImg.className = 'weather-gif dark-mode-gif';
  darkGifImg.alt = 'Weather condition';
  weatherGifContainer.appendChild(darkGifImg);
  
  // Remove the original img if it exists
  const originalImg = document.getElementById('weather-gif');
  if (originalImg) {
    originalImg.remove();
  }

  // API Key - Replace with your OpenWeatherMap API key
  const apiKey = '72884977f6f1d758ac61512d1547665b'; // Replace this with your actual API key

  // Track current weather category
  let currentWeatherCategory = 'default';

  // Multiple phrases for each category to ensure variety
  const weatherPhrases = {
    sunny: [
      "IT'S SUNNY OUT THERE",
      "LOOK AT THAT SUNSHINE!",
      "PERFECT DAY FOR SUNGLASSES!",
      "CLEAR SKIES AND GOOD VIBES!"
    ],
    cloudy: [
      "LOOKS PRETTY CLOUDY TODAY",
      "THE CLOUDS ARE HAVING A PARTY",
      "CLOUD STORAGE IS FULL TODAY",
      "CLOUDS ARE NATURE'S SUNBLOCK"
    ],
    rainy: [
      "I THINK THERES A GOOD CHANCE ITS GONNA RAIN",
      "DAMN IT'S POURING RIGHT NOW!",
      "IT'S RAINING A LITTLE BIT",
      "PERFECT WEATHER FOR STAYING IN!"
    ],
    windy: [
      "HOLD ONTO YOUR HATS, IT'S WINDY",
      "THE WIND IS REALLY BLOWING TODAY!",
      "KITES WOULD FLY GREAT RIGHT NOW!",
      "THE TREES ARE DANCING IN THE WIND!"
    ],
    default: [
      "SEARCH FOR A CITY TO SEE THE WEATHER",
      "WEATHER IS HAPPENING SOMEWHERE",
      "WHAT'S THE WEATHER LIKE?",
      "LOOKING FOR WEATHER INFO?"
    ]
  };

  // Use the EXACT same paths that worked in your test.html file
  const weatherGifs = {
    light: {
      sunny: 'gifs/dark-sunny.gif',
      cloudy: 'gifs/dark-cloudy.gif',
      rainy: 'gifs/dark-rainy.gif',
      windy: 'gifs/dark-windy.gif',
      default: 'gifs/sunny-light.gif'
    },
    dark: {
      sunny: 'gifs/light-sunny.gif',
      cloudy: 'gifs/light-cloudy.gif',
      rainy: 'gifs/light-rainy.gif',
      windy: 'gifs/light-windy.gif',
      default: 'gifs/sunny-dark.gif'
    }
  };

  // Track the last phrase used for each category
  const lastUsedPhrases = {
    sunny: null,
    cloudy: null,
    rainy: null,
    windy: null,
    default: null
  };

  // Function to update the GIFs based on current weather category
  function updateGifs() {
    const lightGifPath = weatherGifs.light[currentWeatherCategory] || weatherGifs.light.default;
    const darkGifPath = weatherGifs.dark[currentWeatherCategory] || weatherGifs.dark.default;
    
    console.log(`Updating GIFs: Category=${currentWeatherCategory}`);
    
    // Set both GIF sources
    lightGifImg.src = lightGifPath;
    darkGifImg.src = darkGifPath;
  }

  // Set default phrase and GIFs on load
  weatherPhrase.textContent = getNewPhrase('default');
  currentWeatherCategory = 'default';
  updateGifs();

  // Function to get a random phrase that's different from the last one used
  function getNewPhrase(category) {
    const phrases = weatherPhrases[category];
    
    // If there's only one phrase or no last phrase, just return a random one
    if (phrases.length <= 1 || !lastUsedPhrases[category]) {
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      lastUsedPhrases[category] = phrase;
      return phrase;
    }
    
    // Filter out the last used phrase
    const availablePhrases = phrases.filter(phrase => phrase !== lastUsedPhrases[category]);
    
    // Select a random phrase from the available ones
    const newPhrase = availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
    
    // Update the last used phrase
    lastUsedPhrases[category] = newPhrase;
    
    return newPhrase;
  }

  // Function to convert Kelvin to Celsius
  function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
  }

  // Function to convert Kelvin to Fahrenheit
  function kelvinToFahrenheit(kelvin) {
    return Math.round((kelvin - 273.15) * 9/5 + 32);
  }

  // Function to get weather data
  async function getWeatherData(city) {
    if (!city.trim()) return;
    
    // Set loading state
    document.body.classList.add('loading');
    
    try {
      // Fetch weather data from OpenWeatherMap API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      
      // Get the main weather condition and wind speed
      const weatherMain = data.weather[0].main.toLowerCase();
      const weatherDescription = data.weather[0].description.toLowerCase();
      const windSpeed = data.wind.speed; // in m/s
      const temp = data.main.temp; // in Kelvin
      const feelsLike = data.main.feels_like; // in Kelvin
      const humidity = data.main.humidity; // in %
      
      // Update city input
      cityInput.value = data.name.toUpperCase();
      
      // Update weather details for hover
      const tempC = kelvinToCelsius(temp);
      const tempF = kelvinToFahrenheit(temp);
      weatherDetails.textContent = `TEMP: ${tempC}°C / ${tempF}°F | HUMIDITY: ${humidity}% | WIND: ${windSpeed} M/S`;
      
      // Determine if it's windy (wind speed > 5.5 m/s or ~12mph)
      const isWindy = windSpeed > 5.5;
      
      // Simplify weather conditions to just 4 categories
      let category = '';
      
      // First check if it's windy
      if (isWindy) {
        category = 'windy';
      } 
      // Then check for rain, snow, or thunderstorm (all categorized as "rainy")
      else if (['rain', 'drizzle', 'thunderstorm', 'snow'].includes(weatherMain)) {
        category = 'rainy';
      } 
      // Check for clouds
      else if (weatherMain === 'clouds' || weatherMain === 'mist' || weatherMain === 'fog' || weatherMain === 'haze') {
        category = 'cloudy';
      } 
      // Default to sunny for clear skies and anything else
      else {
        category = 'sunny';
      }
      
      // Check if weather category has changed
      if (category !== currentWeatherCategory) {
        // Update current weather category
        currentWeatherCategory = category;
        
        // Update the GIFs
        updateGifs();
      }
      
      // Get a new phrase
      weatherPhrase.textContent = getNewPhrase(category);
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      alert('City not found. Please try again.');
    } finally {
      document.body.classList.remove('loading');
    }
  }

  // Force input to uppercase
  cityInput.addEventListener('input', function() {
    this.value = this.value.toUpperCase();
  });

  // Event listener for search button
  searchButton.addEventListener('click', () => {
    getWeatherData(cityInput.value);
  });

  // Event listener for Enter key in search input
  cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      getWeatherData(cityInput.value);
    }
  });

  // Dark mode toggle
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? 'LIGHT MODE' : 'DARK MODE';
  });
});