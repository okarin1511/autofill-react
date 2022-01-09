import React, { useEffect, useState, useRef } from 'react';
import './App.css';

const Auto = () => {

  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const pokemon = [];
    const promises = new Array(20)
      .fill()
      .map((v, i) => fetch(`https://pokeapi.co/api/v2/pokemon-form/${i + 1}`));
    Promise.all(promises).then((pokemonArr) => {
      return pokemonArr.map(res => 
        res.json().then(({name, sprites: { front_default: sprite } }) => {
          return pokemon.push({name, sprite})
        })
      )
    });
    setOptions(pokemon);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = event => {
    const {current: wrap} = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  }

  const setPokeDex = poke => {
    setSearch(poke);
    setDisplay(false);
  }

  return (
    <div ref={wrapperRef} className='flex-container flex-column pos-rel'>
      <input 
        id="auto" 
        onClick={() => setDisplay(!display)} 
        placeholder="Type to search"
        value={search} 
        onChange={event => setSearch(event.target.value)}
      />
      {display && (
        <div className='autoContainer'>
          {options
            .filter(({name}) => name.indexOf(search.toLowerCase()) > -1)
            .map((v, i) => {
              return (
                <div onClick={() => setPokeDex(v.name)} className='option' key={i} tabIndex="0">
                  <span>{v.name}</span>
                  <img src={v.sprite} alt="pokemon" />
                </div>
              );
          })}
        </div>

      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h1>Custom Autofill</h1>
      <div className='auto-container'>
        <Auto />
      </div>
    </div>
  );
}

export default App;
