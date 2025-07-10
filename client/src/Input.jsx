import { useState, useEffect } from 'react'

function YearInput({ formHook, form }) {
  const year_start = 1978;
  const year_end = new Date().getFullYear();

  const years = Array.from({ length: year_end - year_start + 1 }, (_, i) => year_start + i);
  return (
    <select name="car_year" value={form.car_year} onChange={formHook}>
      {years.map(year => (
        <option key={year} value={year}>{year}</option>
      ))}
    </select>
  );
}

function CarMake({ formHook, form }){
  const carBrands = [
    "Acura",
    "Alfa Romeo",
    "Audi",
    "BMW",
    "Buick",
    "Cadillac",
    "Chevrolet",
    "Chrysler",
    "Citroën",
    "Dodge",
    "Fiat",
    "Ford",
    "Genesis",
    "GMC",
    "Honda",
    "Hyundai",
    "Infiniti",
    "Jaguar",
    "Jeep",
    "Kia",
    "Land Rover",
    "Lexus",
    "Lincoln",
    "Maserati",
    "Mazda",
    "Mercedes-Benz",
    "Mini",
    "Mitsubishi",
    "Nissan",
    "Peugeot",
    "Porsche",
    "RAM",
    "Renault",
    "Saab",
    "Subaru",
    "Suzuki",
    "Tesla",
    "Toyota",
    "Volkswagen",
    "Volvo"
  ];

  return (
    <select name="car_make" value={form.car_make} onChange={formHook}>
      {carBrands.map(brand => (
        <option key={brand} value={brand.toLowerCase()}>{brand}</option>
      ))}
    </select>
  );
}

function Input({ handleSubmit, formHook, form, handleAddressChange, handleDestinationChange }) {
  
  const [input, setInput] = useState('');
  const [input_destination, setInputDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestions_destination, setSuggestionsDestination] = useState([]);
  const [address, setAddress] = useState('');

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
        setSuggestions(data.predictions || []);
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
        console.log("Retrieved data: ", data)
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
          setInput(formattedAddress);
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
  }

  const handleDestinationInputChange = (value) => {
    setInputDestination(value);
    setDestinationSelected(false);
  }
  
  return (
    <form onSubmit={handleSubmit}>
        <br/>
        <label>
          Brand:
          <CarMake formHook={formHook} form={form}/>
        </label>
        <br/>
        <label>
          Model:
          <input type="text" name="car_model" value={form.car_model} onChange={formHook}/>
        </label>
        <br/>
        <label>
          Year:
          <YearInput formHook={formHook} form={form}/>
        </label>
        <br/>
        <label>
          Origin:
        </label>
        <div style={{position:'relative'}}>
          <input type="text" name="location_origin" value={input} onChange={(e) => handleInputChange(e.target.value)}/>
            {/* Suggestion Dropdown - positioned absolutely relative to input */}
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
                maxHeight: '200px',
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
                    onClick={() => handleSelect(s.description)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(207, 4, 4, 0.93)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {s.description}
                  </li>
                ))}
              </ul>
            )}
          <button type="button" onClick={handleLocation}>Locate Me</button>
          </div>
        <label>Destination:</label>
        <div style={{position:'relative'}}>
          <input type="text" name="location_destination" value={input_destination} onChange={(e) => handleDestinationInputChange(e.target.value)}/>
            {/* Suggestion Dropdown - positioned absolutely relative to input */}
            {suggestions_destination.length > 0 && (
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
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {suggestions_destination.map((s, i) => (
                  <li
                    key={i}
                    style={{ 
                      padding: '10px', 
                      cursor: 'pointer',
                      borderBottom: i < suggestions_destination.length - 1 ? '1px solid #eee' : 'none'
                    }}
                    onClick={() => handleDestinationSelect(s.description)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(207, 4, 4, 0.93)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {s.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        <br/>
        <br/>
        <button type="submit">Calculate</button>
    </form>
  )
}

export default Input;