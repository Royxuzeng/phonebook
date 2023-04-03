import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [search, setSearch] = useState('');
  const [countries, setCountries] = useState([]);

  const fetchCountries = async (query) => {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${query}`);
    setCountries(response.data);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    if (e.target.value.length > 1) {
      fetchCountries(e.target.value);
    } else {
      setCountries([]);
    }
  };

  const handleShow = (country) => {
    setCountries([country]);
  };

  const displayResult = () => {
    if (countries.length > 10) {
      return <p>Too many matches, please make your query more specific.</p>;
    } else if (countries.length > 1) {
      return <CountryList countries={countries} onShow={handleShow} />;
    } else if (countries.length === 1) {
      return <CountryDetails country={countries[0]} />;
    } else {
      return null;
    }
  };

  return (
    <div>
      <input type="text" value={search} onChange={handleChange} />
      {displayResult()}
    </div>
  );
}

const CountryList = ({ countries, onShow }) => (
  <ul>
    {countries.map((country) => (
      <li key={country.cca3}>
        {country.name.common}
        <button onClick={() => onShow(country)}>Show</button>
      </li>
    ))}
  </ul>
);

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
      );
      setWeather(response.data);
    };

    if (country.capital) {
      fetchWeather();
    }
  }, [country.capital]);

  return (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area} km²</p>
    <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="200" />
    <h3>Languages:</h3>
    <ul>
      {Object.values(country.languages).map((language, index) => (
        <li key={index}>{language}</li>
      ))}
    </ul>
    <WeatherReport weather={weather} />
  </div>
  )
};


const WeatherReport = ({ weather }) => {
  if (!weather) {
    return null;
  }

  const { main, description, icon } = weather.weather[0];
  const temperature = Math.round(weather.main.temp);

  return (
    <div>
      <h3>Weather in {weather.name}</h3>
      <p>
        <strong>{main}:</strong> {description}
      </p>
      <p>
        <strong>Temperature:</strong> {temperature}°C
      </p>
      <img
        src={`http://openweathermap.org/img/w/${icon}.png`}
        alt={description}
        width="50"
      />
    </div>
  );
};

export default App;
