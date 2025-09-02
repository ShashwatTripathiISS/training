import React, {useState} from 'react'
import './App.css';
import {Country, State, City} from 'country-state-city';

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
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const countries = Country.getAllCountries();

  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];

  const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setSelectedState('');
    setSelectedCity('');
    setWeatherData(undefined);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setWeatherData(undefined);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setWeatherData(undefined);
  };

  const getWeather = () => {
    console.log("Fetching weather for:", selectedCity);
    if(selectedCity){
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=${unit}&APPID=${apiKey}`)
      .then(response => response.json())
      .then(data => {setWeatherData(data)})
    }
  }

  return (
    <div className="container">
      <div className="dropdowns-container">
        <select className="input" value={selectedCountry} onChange={handleCountryChange}>
          <option value="">Select Country</option>
          {countries.map(country => (
            <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
          ))}
        </select>
        <select className="input" value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
          <option value="">Select State</option>
          {states.map(state => (
            <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
          ))}
        </select>
        <select className="input" value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city.name} value={city.name}>{city.name}</option>
          ))}
        </select>
        <div className="unit-toggle-row">
          <span className="unit-toggle-label">
            {unit === "metric" ? "Celsius" : "Fahrenheit"}
          </span>
          <label className="unit-switch">
            <input
              type="checkbox"
              checked={unit === "imperial"}
              onChange={() => setUnit(unit === "metric" ? "imperial" : "metric")}
            />
            <span className="unit-slider"></span>
          </label>
        </div>
        <button className="get-weather-btn" onClick={getWeather} disabled={!selectedCity} style={{marginTop: "16px"}}>Get Weather</button>
      </div>


      {weatherData && weatherData.main ? (
        <div className='weather-data'>
          <p className='city-name'>{weatherData.name}</p>
          <p className='temperature'>{Math.round(weatherData.main.temp)}<span>{unit === "metric" ? "°C" : "°F"}</span></p>
          <p className='weather-condition'>{weatherData.weather[0].main}</p>
          <p className='humidity'>{weatherData.main.humidity} %</p>
        </div>
      ) : (
        <div className='headline'>
          <p>This is the Weather App! Select a city to get the weather.</p>
        </div>
      )}

      {weatherData && weatherData.cod === "404" ? (
        <div className='weather-data'>
          <p className='city-name'>City not found</p>
        </div>
      ) : null}
    </div>
  );
}

export default App