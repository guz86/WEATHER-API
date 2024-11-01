
import { ChangeEvent, useState } from 'react'
import './App.css'
//const apiKey = import.meta.env.VITE_API_KEY;
const apiKey = import.meta.env.VITE_API_KEY;

function App() {
  // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

  // https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

  type optionType = { name: string, country: string, state: string, lat: number, lon: number };

  const [term, setTerm] = useState<string>('');
  const [options, setOptions] = useState<optionType[]>([]);

  const getSearchOptions = (value: string) => {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${apiKey}`)
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
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('onInputChange e', e.target.value)
    // const value = e.target.value.trim();
    const value = e.target.value;
    setTerm(value);

    if (value === '') return;

    getSearchOptions(value)
  }

  const onSubmit = () => {
    if (!term || options.length === 0) return;
    onOptionSelect(options[0])
  }


  const onOptionSelect = (option: optionType) => {
    console.log({ option })

    setOptions([]);
    setTerm(option.name);

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${option.lat}&lon=${option.lon}&units=metric&appid=${apiKey}`)
      .then((res) => res.json())
      .then((data) => { console.log('data', { data }) });
  }

  return (
    <>
      <main className="flex justify-center items-center bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400 h-[100vh] w-full">
        <section className="w-full md:max-w-[500px] p-4 flex flex-col text-center items-center justify-center md:px-10 lg:p-24 h-full lg:h-[500px] bg-white bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg text-zinc-700">
          <h1 className='text-4xl font-thin'>Weather <span className='font-black'>Forecast</span></h1>
          <p className='text-sm mt-2'>Enter below a place you want to know the weather of and select an option from the dropdown</p>
          <div className=' relative flex mt-10 md:mt-4'>
            <input onChange={onInputChange} type="text" value={term} className='px-2 py-1 rounded-l-md border-2 border-white' />

            <ul className="absolute top-9 bg-white ml-1 rounded-b-md">
              {options.map((option, index) => (
                <li key={`${option.name}-${option.state || 'no-state'}-${index}`}>
                  <button onClick={() => onOptionSelect(option)} className='text-left text-sm w-full hover:bg-zinc-700 hover:text-white px-2 py-1 cursor-pointer'>
                    {option.name}, {option.state ? option.state + ', ' : ''}{option.country}
                  </button>
                </li>
              ))}
            </ul>

            <button onClick={()=>onSubmit()} className='rounded-r-md border-2 border-zinc-100 hover:border-zinc-500 hover:text-zinc-500 text-zinc-100 px-2 py-1 cursor-pointer'>search</button>
          </div>
        </section>
      </main>

    </>
  )
}

export default App
