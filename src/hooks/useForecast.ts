import { ChangeEvent, useState } from 'react';
import useDebounce from '../utils/useDebounce';
import { forecastType, optionType } from '../types';
const apiKey = import.meta.env.VITE_API_KEY;

export const useForecast = () => {
  // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
  // https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

  const [term, setTerm] = useState<string>('');
  const [options, setOptions] = useState<optionType[]>([]);
  const [selectedOption, setSelectedOption] = useState<optionType | null>(null);
  const [forecast, setForecast] = useState<forecastType | null>(null);

  const getSearchOptions = (value: string) => {
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const formattedOptions = data.map((item: optionType) => ({
          name: item.name,
          country: item.country,
          state: item.state || '',
          lat: item.lat,
          lon: item.lon,
        }));

        setOptions(formattedOptions);
      });
  };

  const debouncedFetchOptions = useDebounce(() => {
    if (term) {
      getSearchOptions(term);
    }
  }, 500);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // const value = e.target.value.trim();
    const value = e.target.value;
    setTerm(value);

    if (value === '') return;

    debouncedFetchOptions();
  };

  const onSubmit = () => {
    if (!term || selectedOption === null) return;

    fetchResult(selectedOption);
  };

  const fetchResult = (option: optionType) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${option.lat}&lon=${option.lon}&units=metric&appid=${apiKey}`
    )
      .then((res) => res.json())
      .then((data) => {
        const forecastData = {
          ...data.city,
          list: data.list.slice(0, 16),
        };
        setForecast(forecastData);
      });
  };

  const onOptionSelect = (option: optionType) => {
    setTerm(option.name);
    setSelectedOption(option);
    setOptions([]);
  };

  return { term, options, forecast, onInputChange, onOptionSelect, onSubmit };
};
