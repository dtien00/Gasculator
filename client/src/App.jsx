import { useState, useEffect } from 'react'
import './App.css'
import Input from './Input.jsx'

function App() {

  const [message, setMessage] = useState('')
  const [address, setAddress] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    car_make: '',
    car_model: '',
    car_year: '',
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
    alert(data.data.car_make); // Display the form data as an Object
  }

  return (
      <Input handleSubmit={handleSubmit} formHook={handleForm} form={formData} handleAddressChange={handleAddressChange} handleDestinationChange={handleDestinationChange}/>
  )
}

export default App
