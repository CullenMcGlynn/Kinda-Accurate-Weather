document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const weatherPhrase = document.getElementById('weather-phrase');
    const weatherDetails = document.getElementById('weather-details');
    const weatherGif = document.getElementById('weather-gif');
  
    // API Key - Replace with your OpenWeatherMap API key
    const apiKey = '72884977f6f1d758ac61512d1547665b'; // Replace this with your actual API key
  
    // Weather phrases for different conditions
    const weatherPhrases = {
      clear: [
        "LOOK AT THAT SUNSHINE!",
        "IT'S BRIGHT AND SUNNY OUT THERE!",
        "PERFECT DAY FOR SUNGLASSES!",
        "CLEAR SKIES AND GOOD VIBES!",
        "SUNNY DAYS ARE HERE AGAIN!"
      ],
      clouds: [
        "CLOUDY WITH A CHANCE OF MEH.",
        "THE CLOUDS ARE HAVING A PARTY.",
        "FIFTY SHADES OF GREY... CLOUDS.",
        "CLOUD STORAGE IS FULL TODAY.",
        "CLOUDS ARE NATURE'S SUNBLOCK."
      ],
      rain: [
        "DAMN IT'S POURING RIGHT NOW!",
        "IT'S RAINING A LITTLE BIT.",
        "PERFECT WEATHER FOR STAYING IN!",
        "RAIN, RAIN, GO AWAY...",
        "I THINK THERES A GOOD CHANCE ITS GONNA RAIN"
      ],
      drizzle: [
        "JUST A LITTLE SPRINKLE.",
        "LIGHT RAIN, HEAVY MOOD.",
        "IT'S DRIZZLING, BRING A JACKET!",
        "NOT QUITE RAIN, NOT QUITE DRY.",
        "NATURE'S MIST SYSTEM ACTIVATED."
      ],
      thunderstorm: [
        "THOR MUST BE ANGRY TODAY!",
        "LIGHTNING AND THUNDER, OH MY!",
        "SHOCKING WEATHER WE'RE HAVING!",
        "MOTHER NATURE'S LIGHT SHOW!",
        "BOOM! WEATHER'S GETTING DRAMATIC!"
      ],
      snow: [
        "WINTER WONDERLAND ACTIVATED!",
        "TIME TO BUILD A SNOWMAN!",
        "BRRR, IT'S SNOWING OUT THERE!",
        "SNOW DAY VIBES!",
        "POWDER DAY! GET THE SKIS!"
      ],
      mist: [
        "IT'S GETTING MISTY!",
        "SPOOKY FOG ALERT!",
        "CAN BARELY SEE WHAT'S AHEAD.",
        "SILENT HILL WEATHER TODAY.",
        "MYSTERIOUS MIST HAS ENTERED THE CHAT."
      ],
      fog: [
        "FOGGY LIKE YOUR MEMORY ON MONDAY MORNING.",
        "THE FOG IS THICK ENOUGH TO CUT.",
        "VISIBILITY? WHAT VISIBILITY?",
        "FOG MACHINE SET TO MAXIMUM.",
        "NATURE'S PRIVACY SCREEN ACTIVATED."
      ],
      haze: [
        "HAZY SHADE OF WEATHER.",
        "IT'S A BIT HAZY OUT THERE.",
        "HAZE FOR DAYS.",
        "VISIBILITY IS TAKING A DAY OFF.",
        "HAZY LIKE A LAZY SUNDAY."
      ],
      wind: [
        "HOLD ONTO YOUR HATS!",
        "THE WIND IS REALLY BLOWING TODAY!",
        "KITES WOULD FLY GREAT RIGHT NOW!",
        "WINDY ENOUGH TO MESS UP YOUR HAIR!",
        "THE TREES ARE DANCING IN THE WIND!"
      ],
      default: [
        "WEATHER IS HAPPENING!",
        "INTERESTING WEATHER WE'RE HAVING!",
        "LOOK OUTSIDE FOR DETAILS!",
        "MOTHER NATURE DOING HER THING!",
        "WEATHER STATUS: IT'S COMPLICATED."
      ]
    };
  
    // Default GIFs for initial state
    const defaultGifs = [
      'gifs/sunny.gif',
      'gifs/cloudy.gif',
      'gifs/rainy.gif',
      'gifs/default.gif'
    ];
  
    // Set a random default GIF on load
    weatherGif.src = defaultGifs[Math.floor(Math.random() * defaultGifs.length)];
  
    // Function to get a random phrase from an array
    function getRandomPhrase(phrases) {
      return phrases[Math.floor(Math.random() * phrases.length)];
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
        
        // Select GIF and phrase based on weather condition
        let gifUrl = '';
        let phraseCategory = '';
        
        // First check for special conditions
        if (isWindy && (weatherMain === 'clear' || weatherMain === 'clouds')) {
          gifUrl = 'gifs/windy.gif';
          phraseCategory = 'wind';
        } else {
          // Then check for regular weather conditions
          switch (weatherMain) {
            case 'clear':
              gifUrl = 'gifs/sunny.gif';
              phraseCategory = 'clear';
              break;
            case 'clouds':
              gifUrl = 'gifs/cloudy.gif';
              phraseCategory = 'clouds';
              break;
            case 'rain':
              gifUrl = 'gifs/Rain_Animation_Loop.gif';
              phraseCategory = 'rain';
              break;
            case 'drizzle':
              gifUrl = 'gifs/rainy.gif';
              phraseCategory = 'drizzle';
              break;
            case 'thunderstorm':
              gifUrl = 'gifs/storm.gif';
              phraseCategory = 'thunderstorm';
              break;
            case 'snow':
              gifUrl = 'gifs/snowy.gif';
              phraseCategory = 'snow';
              break;
            case 'mist':
              gifUrl = 'gifs/foggy.gif';
              phraseCategory = 'mist';
              break;
            case 'fog':
              gifUrl = 'gifs/foggy.gif';
              phraseCategory = 'fog';
              break;
            case 'haze':
              gifUrl = 'gifs/foggy.gif';
              phraseCategory = 'haze';
              break;
            default:
              gifUrl = 'gifs/default.gif';
              phraseCategory = 'default';
          }
        }
        
        // Set the weather GIF and phrase
        weatherGif.src = gifUrl;
        weatherGif.alt = `${weatherMain} weather`;
        weatherPhrase.textContent = getRandomPhrase(weatherPhrases[phraseCategory] || weatherPhrases.default);
        
      } catch (err) {
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