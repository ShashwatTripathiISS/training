import React, {useState} from 'react'
import './App.css';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  cod?: string | number;
  message?: string;  
}

function App() {
  const apiKey = process.env.REACT_APP_APIKEY;
  console.log("API Key:", apiKey);
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [city, setCity] = useState("");

  const getWeather = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === "Enter"){
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apiKey}`)
      .then(response => response.json())
      .then(
        data => {
          setWeatherData(data)
          setCity("")
        }
      )
    }
  }

  return (
    <div className="container">
      <input 
        className='input' 
        placeholder='Enter a City...' 
        onChange={e => setCity(e.target.value)}
        value={city}
        onKeyDown={getWeather}
      />

      {weatherData && weatherData.main? (
        <div className='weather-data'>
          <p className='city-name'>{weatherData.name}</p>
          <p className='temperature'>{Math.round(weatherData.main.temp)} °F</p>
          <p className='weather-condition'>{weatherData.weather[0].main}</p>
          <p className='humidity'>{weatherData.main.humidity} %</p>
        </div>
      ) : (
        <div className='headline'>
          <p>This is the Weather App! Enter a city to get the weather of </p>
        </div>

      )}

      {weatherData && weatherData.cod === "404" ? (
        <div className='weather-data'>
          <p className='city-name'>City not found</p>
        </div>
      ) : null}
    </div>
  )
}

export default App