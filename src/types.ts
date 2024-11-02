import { ChangeEvent } from "react";

export type forecastType = {
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
  
  export type ForecastProps = {
    forecast: forecastType;
  };

  export type optionType = {
    name: string;
    country: string;
    state: string;
    lat: number;
    lon: number;
  };
  
  export type SearchProps = {
    term: string;
    options: optionType[];
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onOptionSelect: (option: optionType) => void;
    onSubmit: () => void;
  };

  export type Props = {
    icon: 'wind' | 'feels' | 'humidity' | 'visibility' | 'pressure' | 'pop';
    title: string;
    info: string | JSX.Element;
    description?: string | JSX.Element;
  };
 