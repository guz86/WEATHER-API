

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

type ForecastProps = {
    forecast: forecastType;
};

const Degree = ({ temp }: { temp: number }): JSX.Element => (
    <>
      <span>
        {temp}
        <sup>o</sup>
      </span>
    </>
  )



import Feels from './Icons/Feels'
import Humidity from './Icons/Humidity'
import Pop from './Icons/Pop'
import Pressure from './Icons/Pressure'
import Visibility from './Icons/Visibility'
import Wind from './Icons/Wind'
import Sunrise from './Icons/Sunrise'
import Sunset from './Icons/Sunset'

type Props = {
  icon: 'wind' | 'feels' | 'humidity' | 'visibility' | 'pressure' | 'pop'
  title: string
  info: string | JSX.Element
  description?: string | JSX.Element
}

const icons = {
  wind: Wind,
  feels: Feels,
  humidity: Humidity,
  visibility: Visibility,
  pressure: Pressure,
  pop: Pop,
}

const Tile = ({ icon, title, info, description }: Props): JSX.Element => {
  const Icon = icons[icon]

  return (
    <article className="w-[140px] h-[130px] text-zinc-700 bg-white/20 backdrop-blur-ls rounded drop-shadow-lg p-2 mb-5 flex flex-col justify-between">
      <div className="flex items-center text-sm font-bold">
        <Icon /> <h4 className="ml-1">{title}</h4>
      </div>
      <h3 className="mt-2 text-lg">{info}</h3>

      <div className="text-xs font-bold">{description}</div>
    </article>
  )
}


const getWindDirection = (deg: number): string => {
    if (deg > 15 && deg <= 75) return 'NE'
  
    if (deg > 76 && deg <= 105) return 'E'
    if (deg > 105 && deg <= 165) return 'SE'
  
    if (deg > 166 && deg <= 195) return 'S'
    if (deg > 195 && deg <= 255) return 'SW'
  
    if (deg > 255 && deg <= 285) return 'W'
    if (deg > 285 && deg <= 345) return 'NW'
  
    return 'N'
  }

const getSunTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000)
    let hours = date.getHours().toString()
    let minutes = date.getMinutes().toString()
  
    if (hours.length <= 1) hours = `0${hours}`
    if (minutes.length <= 1) minutes = `0${minutes}`
  
    return `${hours}:${minutes}`
  }

  const getHumidityValue = (level: number): string => {
    if (level <= 55) return 'Dry and comfortable'
    if (level > 55 && level <= 65) return 'A bit uncomfortable, sticky feeling'
  
    return 'Lots of moisture, uncomfortable air'
  }

  const getPop = (value: number): string => {
    if (value <= 0.33) return 'Low probability'
    if (value > 0.33 && value <= 0.66) return 'Moderate probability'
  
    return 'High probability'
  }

  const getVisibilityValue = (number: number): string => {
    if (number <= 50) return 'Dangerously foggy'
    if (number > 50 && number <= 500) return 'Expect heavy fog'
    if (number > 500 && number <= 2000) return 'Expect some fog'
    if (number > 2000 && number <= 9000) return 'Expect some haze'
  
    return 'Very clear day'
  }

export const Forecast = ({forecast}: ForecastProps) => {
    const today = forecast.list[0]

  return (
<div className="w-full md:max-w-[500px] py-4 md:py-4 md:px-10 lg:px-24 h-full lg:h-auto bg-white bg-opacity-20 backdrop-blur-ls rounded drop-shadow-lg">
      <div className="mx-auto w-[300px]">
        <section className="text-center">
          <h2 className="text-2xl font-black">
            {forecast.name} <span className="font-thin">{forecast.country}</span>
          </h2>
          <h1 className="text-4xl font-extrabold">
            <Degree temp={Math.round(today.main.temp)} />
          </h1>
          <p className="text-sm">
            {today.weather[0].main} ({today.weather[0].description})
          </p>
          <p className="text-sm">
            H: <Degree temp={Math.ceil(today.main.temp_max)} /> L:{' '}
            <Degree temp={Math.floor(today.main.temp_min)} />
          </p>
        </section>

        <section className="flex overflow-x-scroll mt-4 pb-2 mb-5">
          {forecast.list.map((item, i) => (
            <div
              key={i}
              className="inline-block text-center w-[50px] flex-shrink-0"
            >
              <p className="text-sm">
                {i === 0 ? 'Now' : new Date(item.dt * 1000).getHours()}
              </p>
              <img
                alt={`weather-icon-${item.weather[0].description}`}
                src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              />
              <p className="text-sm font-bold">
                <Degree temp={Math.round(item.main.temp)} />
              </p>
            </div>
          ))}
        </section>

        <section className="flex flex-wrap justify-between text-zinc-700">
          <div className="w-[140px] text-xs font-bold flex flex-col items-center bg-white/20 backdrop-blur-ls rounded drop-shadow-lg py-4 mb-5">
            <Sunrise /> <span className="mt-2">{getSunTime(forecast.sunrise)}</span>
          </div>
          <div className="w-[140px] text-xs font-bold flex flex-col items-center bg-white/20 backdrop-blur-ls rounded drop-shadow-lg py-4 mb-5">
            <Sunset /> <span className="mt-2">{getSunTime(forecast.sunset)}</span>
          </div>

          <Tile
            icon="wind"
            title="Wind"
            info={`${Math.round(today.wind.speed)} km/h`}
            description={`${getWindDirection(
              Math.round(today.wind.deg)
            )}, gusts 
            ${today.wind.gust.toFixed(1)} km/h`}
          />
          <Tile
            icon="feels"
            title="Feels like"
            info={<Degree temp={Math.round(today.main.feels_like)} />}
            description={`Feels ${
              Math.round(today.main.feels_like) < Math.round(today.main.temp)
                ? 'colder'
                : 'warmer'
            }`}
          />
          <Tile
            icon="humidity"
            title="Humidity"
            info={`${today.main.humidity} %`}
            description={getHumidityValue(today.main.humidity)}
          />
          <Tile
            icon="pop"
            title="Precipitation"
            info={`${Math.round(today.pop * 100)}%`}
            description={`${getPop(today.pop)}, clouds at ${today.clouds.all}%`}
          />
          <Tile
            icon="pressure"
            title="Pressure"
            info={`${today.main.pressure} hPa`}
            description={` ${
              Math.round(today.main.pressure) < 1013 ? 'Lower' : 'Higher'
            } than standard`}
          />
          <Tile
            icon="visibility"
            title="Visibility"
            info={`${(today.visibility / 1000).toFixed()} km`}
            description={getVisibilityValue(today.visibility)}
          />
        </section>
      </div>
    </div>
  )
}
