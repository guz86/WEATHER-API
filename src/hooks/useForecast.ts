import { ChangeEvent, useState } from 'react';
import useDebounce from '../utils/useDebounce';
import { forecastType, optionType } from '../types';

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

const apiKey = import.meta.env.VITE_API_KEY;
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const LIMIT = 5;
const UNITS = 'metric';

export const useForecast = () => {
  const [term, setTerm] = useState<string>('');
  const [options, setOptions] = useState<optionType[]>([]);
  const [selectedOption, setSelectedOption] = useState<optionType | null>(null);
  const [forecast, setForecast] = useState<forecastType | null>(null);

  const getSearchOptions = async (value: string) => {
    try {
      const response = await fetch(
        `${GEO_API_URL}?q=${value.trim()}&limit=${LIMIT}&appid=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const formattedOptions = data.map((item: optionType) => ({
        name: item.name,
        country: item.country,
        state: item.state || '',
        lat: item.lat,
        lon: item.lon,
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.error('Error in data retrieval:', error);
    }
  };

  const debouncedFetchOptions = useDebounce(async () => {
    if (term) {
      await getSearchOptions(term);
    }
  }, 500);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTerm(value);

    if (value === '') return;

    debouncedFetchOptions();
  };

  const onSubmit = async () => {
    if (!term || selectedOption === null) return;

    await fetchResult(selectedOption);
  };

  const fetchResult = async (option: optionType) => {
    try {
      const response = await fetch(
        `${FORECAST_API_URL}?lat=${option.lat}&lon=${option.lon}&units=${UNITS}&appid=${apiKey}`
      );
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const forecastData = {
        ...data.city,
        list: data.list.slice(0, 16),
      };
      setForecast(forecastData);
    } catch (error) {
      console.error('Error in the forecast:', error);
    }
  };

  const onOptionSelect = (option: optionType) => {
    setTerm(option.name);
    setSelectedOption(option);
    setOptions([]);
  };

  return { term, options, forecast, onInputChange, onOptionSelect, onSubmit };
};
