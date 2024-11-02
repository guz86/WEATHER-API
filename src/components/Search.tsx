import { ChangeEvent } from 'react';

type optionType = {
  name: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
};

type Props = {
  term: string;
  options: optionType[];
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onOptionSelect: (option: optionType) => void;
  onSubmit: () => void;
};

function Search({
  term,
  options,
  onInputChange,
  onOptionSelect,
  onSubmit,
}: Props) {
  return (
    <>
      <section className="w-full md:max-w-[500px] p-4 flex flex-col text-center items-center justify-center md:px-10 lg:p-24 h-full lg:h-[500px] bg-white bg-opacity-20 backdrop-blur-lg rounded drop-shadow-lg text-zinc-700">
        <h1 className="text-4xl font-thin">
          Weather <span className="font-black">Forecast</span>
        </h1>
        <p className="text-sm mt-2">
          Enter below a place you want to know the weather of and select an
          option from the dropdown
        </p>
        <div className=" relative flex mt-10 md:mt-4">
          <input
            onChange={onInputChange}
            type="text"
            value={term}
            className="px-2 py-1 rounded-l-md border-2 border-white"
          />

          <ul className="absolute top-9 bg-white ml-1 rounded-b-md">
            {options.map((option, index) => (
              <li key={`${option.name}-${option.state || 'no-state'}-${index}`}>
                <button
                  onClick={() => onOptionSelect(option)}
                  className="text-left text-sm w-full hover:bg-zinc-700 hover:text-white px-2 py-1 cursor-pointer"
                >
                  {option.name}, {option.state ? option.state + ', ' : ''}
                  {option.country}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSubmit()}
            className="rounded-r-md border-2 border-zinc-100 hover:border-zinc-500 hover:text-zinc-500 text-zinc-100 px-2 py-1 cursor-pointer"
          >
            search
          </button>
        </div>
      </section>
    </>
  );
}

export default Search;
