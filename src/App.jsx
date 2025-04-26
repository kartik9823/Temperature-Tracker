import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';



function App() {
  const [city,setCity]=useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  const [suggestions, setSuggestions] = useState([]);
  const [weatherCondition, setWeatherCondition] = useState('');


  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(); // returns something like "4/13/2025, 9:10:15 PM"
  };
  
  useEffect(() => {
    const fetchDefaultCity = async () => {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=Mumbai`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error('Error fetching default city:', err);
      }
    };
  
    fetchDefaultCity();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleString());
    }, 1000); // updates every second

    return () => clearInterval(interval); // cleanup
  }, []);


  
  

  const handleSearch=async ()=>{
    if(!city) return;

    try{
      const res=await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&days=3`
      );
      const data=await res.json();

      if(data.error){
        setWeather(null);
        setError(data.error.message);
      }else{
        setWeather(data);
        console.log(weather);
        setError('');
      }

    }catch(err){
      console.log(err);
      setError('Failed to fetch weather');
    }

  }

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`
      );
      const data = await res.json();
      
      setWeather(data);
      
      setWeatherCondition(data.current.condition.text.toLowerCase());
      
      if(data.error){
        alert('Enter a valid city name');
        setWeather(null);
        setError(data.error.message);
      }else{
        setWeather(data);
        // console.log(weather);
        setError('');
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const getBackgroundImage = () => {
    const condition = weather?.current?.condition?.text.toLowerCase() || '';
  
    if (condition.includes('sunny') || condition.includes('clear')) {
      return 'url(C:\Users\karti\OneDrive\Desktop\Res_project\Weather App\weather-app\summer.avif)';
    } else if (condition.includes('rain')) {
      return 'url(C:\Users\karti\OneDrive\Desktop\Res_project\Weather App\weather-app\rainy.avif)';
    } else if (condition.includes('cloud')) {
      return 'url(C:\Users\karti\OneDrive\Desktop\Res_project\Weather App\weather-app\snow.avif)';
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return 'url(C:\Users\karti\OneDrive\Desktop\Res_project\Weather App\weather-app\winter.avif)';
    } else {
      return 'url(C:\Users\karti\OneDrive\Desktop\Res_project\Weather App\weather-app\normal.avif)';
    }
  };
  
  
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        try {
          const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3`
          );
          const data = await res.json();
          setWeather(data); // Show weather based on current location
        } catch (error) {
          console.error("Failed to fetch weather:", error);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleInputChange = async (e) => {
    const input = e.target.value;
    setCity(input);
  
    if (input.length > 2) {
      try {
        const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
          
          params: {
            namePrefix: input,
            limit: 6,
            sort: '-population',
          },
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,  // 🔑 Replace with your actual key
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
          }
        });
  
        const cities = response.data.data.map(city => `${city.city}, ${city.countryCode}`);
        setSuggestions(cities);
  
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (selectedCity) => {
    setCity(selectedCity);
    setSuggestions([]);
    // Optionally fetch weather here
  };

  return (
    <>
        <div className='gen-interface'>
          <h1>🌤️SkyCast</h1>
          <div className='form'>
            <div style={{ position: 'relative', width: '300px' }}>
              <input type="text" placeholder='Enter Your City Name' value={city} onChange={handleInputChange} />
              <ul className="suggestions-list">
                {suggestions.map((item, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
                <button className='form-report' onClick={fetchWeather}>Get Report</button>
                <button className='form-tracker' onClick={handleLocationClick}>Track Location</button> 
            </div>  
          </div>

          {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

          {/* TEAMPERATURE REPORT OF A CITY ON THE DAY */}
          {weather && (
            <div className='curr-temp'>
              <h2>Weather in {weather.location.name},{weather.location.country}</h2>
              {/* <p>{weather.location.localtime}</p> */}
              <p>Date & Time: {getCurrentDateTime()}</p>
              <img className='curr-icon' src={`https:${weather.current.condition.icon}`} alt="weather icon" />
              <p>{weather.current.temp_c}°C - {weather.current.condition.text}</p>
              <p>Humidity: {weather.current.humidity}%</p>
              <p>Wind: {weather.current.wind_kph} km/h</p>
            </div>

          )}
        </div>
      

          {/* FORECAST FOR 3 DAYS */}
          {weather && weather.forecast && (
            <div className="forecast-section">
              <h3 className="forecast-title">3-Day Forecast</h3>
              <div className="forecast-container">
                {weather.forecast.forecastday.map((day, index) => (
                  <div key={index} className="forecast-card">
                    <div className="forecast-date">{day.date}</div>
                    <img src={day.day.condition.icon} alt={day.day.condition.text} />
                    <div>{day.day.condition.text}</div>
                    <div className='forecast-temp'>{day.day.maxtemp_c}°C / {day.day.mintemp_c}°C</div>
                  </div>
                ))}
              </div>
            </div>
          )}

      
      
      
    </>
  )
}

export default App
