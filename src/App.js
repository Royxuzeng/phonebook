import React, { useState } from 'react';
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

  const displayResult = () => {
    if (countries.length > 10) {
      return <p>Too many matches, please make your query more specific.</p>;
    } else if (countries.length > 1) {
      return <CountryList countries={countries} />;
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

const CountryList = ({ countries }) => (
  <ul>
    {countries.map((country) => (
      <li key={country.cca3}>{country.name.common}</li>
    ))}
  </ul>
);

const CountryDetails = ({ country }) => (
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
  </div>
);

export default App;
