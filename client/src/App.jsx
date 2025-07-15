import { useState, useEffect } from 'react'
import './App.css'
import CarInput from './CarInput.jsx'
import LocationInput from './LocationInput.jsx';
import GasInput from './GasInput.jsx';

function App() {

  const [message, setMessage] = useState('')
  const [address, setAddress] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    car_make: '',
    car_model: '',
    car_year: '',
    car_option: '',
    location_origin: '',
    location_destination: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error fetching message:', err));
  }, []);

  useEffect(() => {
    // react to any changes in address
    console.log("Address changed to:", address);
    setFormData(prevData => ({
      ...prevData,
      location_origin: address
    }))
  }, [address]);

  
  useEffect(() => {
    // react to any changes in address
    console.log("Destination changed to:", destination);
    setFormData(prevData => ({
      ...prevData,
      location_destination: destination
    }))
  }, [destination]);

  const handleAddressChange = (newAddress) => {
    console.log("Address input changed to:", newAddress);
    setAddress(newAddress);
  }

  const handleDestinationChange = (newDestination) => {
    console.log("Destination input changed to:", newDestination);
    setDestination(newDestination);
  }
  const handleForm = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Handling specific models for car_make
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data: ', formData);
    const res = await fetch('http://localhost:8000/api/form', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.message); // Display the response message "Form submitted!"

    console.log('Determining distance and time...');
    const req = await fetch(`http://localhost:8000/determine-distance?origin=${formData.location_origin}&destination=${formData.location_destination}`);
    const req_data = await req.json();
    console.log('Distance and time determined:', req_data.distance, " ", req_data.duration);
  }

  return (
    <div className="Gasculator" style={{maxWidth: '800px', margin: '0 auto', padding: '20px', border: '2px solid aquamarine', borderRadius: '10px'}}>
    <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
      }}>
      <CarInput handleForm={handleForm} form={formData}/>
      <LocationInput handleSubmit={handleSubmit} formHook={handleForm} form={formData} handleAddressChange={handleAddressChange} handleDestinationChange={handleDestinationChange}/>
    </div>

    <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
      }}>
      <GasInput formHook={handleForm} form={formData}/>
    </div>
    <button style={{width: '80px', height: '30px', position: 'absolute', top: '70%', right: '50%'}} type="submit" onClick={handleSubmit}>Calculate</button>
    </div>
  )
}

export default App
