import { useState, useEffect } from 'react'

function AutoCompleteSuggestions({suggestions, onSelect, name, value, onChange}) {
  return (
      <>
          <input autoComplete='off' type="text" name={name} value={value} onChange={(e) => onChange(e.target.value)} 
            placeholder="Enter location..."
            style={{
              width: '90%'
            }}/>
          {suggestions.length > 0 && (
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'black', 
              border: '1px solid #ccc',
              borderTop: 'none',
              borderRadius: '0 0 4px 4px',
              maxHeight: '250px',
              overflowY: 'auto',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  style={{ 
                    padding: '10px', 
                    cursor: 'pointer',
                    borderBottom: i < suggestions.length - 1 ? '1px solid #eee' : 'none'
                  }}
                  onClick={() => onSelect(s.description)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(170, 170, 170, 0.45)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {s.description}
                </li>
              ))}
            </ul>
          )}
      </>
  )
}

function LocationInput({ handleSubmit, formHook, form, handleAddressChange, handleDestinationChange }) {
  
  const [input, setInput] = useState('');
  const [input_destination, setInputDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestions_destination, setSuggestionsDestination] = useState([]);
  const [address, setAddress] = useState('');
  const [locateMeUsed, setLocateMeUsed] = useState(false);

  const [originSelected, setOriginSelected] = useState(false);
  const [destinationSelected, setDestinationSelected] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestions = async() => {
      if (input.length < 3 || originSelected) {
        if (input.length >= 3) {
          setError('Input must be at least 3 characters long before suggestions are made.');
          console.log("Input too short for suggestions");
        }
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:8000/forward-geocode?input=${encodeURIComponent(input)}`)
        const data = await res.json();
        console.log("Retrieved data: ", data)
        if (locateMeUsed==false){
          setSuggestions(data.predictions || []);
        }
      }
      catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to fetch suggestions');
      }
    }

    const delay = setTimeout(fetchSuggestions, 400)
    return () => clearTimeout(delay);
  }, [input, originSelected])

  
  useEffect(() => {
    const fetchSuggestions = async() => {
      if (input_destination.length < 3 || destinationSelected) {
        if(input_destination.length >= 3) {
          setError('Input must be at least 3 characters long before suggestions are made.');
          console.log("Input too short for suggestions");
        }
        setSuggestionsDestination([]);
        return;
      }
      try {
        const res = await fetch(`http://localhost:8000/forward-geocode?input=${encodeURIComponent(input_destination)}`)
        const data = await res.json();
        setSuggestionsDestination(data.predictions || []);
      }
      catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to fetch suggestions');
      }
    }

    const delay = setTimeout(fetchSuggestions, 400)
    return () => clearTimeout(delay);
  }, [input_destination, destinationSelected])

  useEffect(() => {
    console.log("Suggestions updated:", suggestions);
  }, [suggestions])

  const handleLocation = () => {
    alert("Getting location...");
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    alert("Geolocation supported by browser.")
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

        try {
          // Call your backend reverse_geocode endpoint
          const response = await fetch(
            `http://localhost:8000/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          if (!response.ok) throw new Error('Failed to fetch address');
          const data = await response.json();

          // Extract formatted address from backend response
          const formattedAddress = data.results?.[0]?.formatted || 'No address found';
          setLocateMeUsed(true);
          handleSelect(formattedAddress);
          console.log('Formatted Address:', formattedAddress);
          setError('');
        } catch (err) {
          setError(err.message);
          setInput('');
        }
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }

  const handleSelect = (description) => {
    handleAddressChange(description);
    setInput(description);
    setSuggestions([]);
    setError('');
    setOriginSelected(true);
  }

  const handleDestinationSelect = (description) => {
    handleDestinationChange(description);
    setInputDestination(description);
    setSuggestionsDestination([]);
    setError('');
    setDestinationSelected(true);
  }

  const handleInputChange = (value) => {
    setInput(value)
    setOriginSelected(false);
    setLocateMeUsed(false);
  }

  const handleDestinationInputChange = (value) => {
    setInputDestination(value);
    setDestinationSelected(false);
  }
  
  return (
    <form onSubmit={handleSubmit} 
        style={{  
          paddingLeft: '15px',
          paddingTop: '15px', 
          border: '2px solid aquamarine', 
          borderRadius: '10px'
        }}>
        <label>Origin:</label>
        <div style={{position:'relative'}}>
          {/* <input autoComplete='off' type="text" name="location_origin" value={input} onChange={(e) => handleInputChange(e.target.value)}/> */}
            <AutoCompleteSuggestions suggestions={suggestions} onSelect={handleSelect} name="location_origin" value={input} onChange={handleInputChange}/>
            <button type="button" onClick={handleLocation} style={{right: '0%', background: 'transparent'}}>Locate Me</button>
        </div>
        <br/>
        <label>Destination:</label>
        <div style={{position:'relative'}}>
          {/* <input autoComplete='off' type="text" name="location_destination" value={input_destination} onChange={(e) => handleDestinationInputChange(e.target.value)}/> */}
            <AutoCompleteSuggestions suggestions={suggestions_destination} onSelect={handleDestinationSelect} name="location_destination" value={input_destination} onChange={handleDestinationInputChange}/>
          </div>
        <br/>
        <br/>
    </form>
  )
}

export default LocationInput;