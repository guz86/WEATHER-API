import { ChangeEvent, useState } from 'react';
const apiKey = import.meta.env.VITE_API_KEY;

export const useForecast = () => {
    // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    // https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

    type optionType = {
        name: string;
        country: string;
        state: string;
        lat: number;
        lon: number;
    };

    type forecastType = {
        name: string;
        country: string;
        list: [
            {
                dt: number;
                main: {
                    feels_like: number;
                    humidity: number;
                    pressure: number;
                    temp: number;
                    temp_max: number;
                    temp_min: number;
                };
                weather: [
                    {
                        main: string;
                        icon: string;
                        description: string;
                    },
                ];
                wind: {
                    speed: number;
                    gust: number;
                    deg: number;
                };
                clouds: {
                    all: number;
                };
                pop: number;
                visibility: number;
            },
        ];
        sunrise: number;
        sunset: number;
    };

    const [term, setTerm] = useState<string>('');
    const [options, setOptions] = useState<optionType[]>([]);
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

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('onInputChange e', e.target.value);
        // const value = e.target.value.trim();
        const value = e.target.value;
        setTerm(value);

        if (value === '') return;

        getSearchOptions(value);
    };

    const onSubmit = () => {
        if (!term || options.length === 0) return;
        onOptionSelect(options[0]);
    };

    const onOptionSelect = (option: optionType) => {
        console.log({ option });

        setOptions([]);
        setTerm(option.name);

        fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${option.lat}&lon=${option.lon}&units=metric&appid=${apiKey}`
        )
            .then((res) => res.json())
            .then((data) => {
                console.log('data', { data });

                const foracastData = {
                    ...data.city,
                    list: data.list.slice(0, 16),
                }
                setForecast(foracastData);

                console.log({ foracastData })
            });
    };
    return { term, options, forecast, onInputChange, onOptionSelect, onSubmit };
};
