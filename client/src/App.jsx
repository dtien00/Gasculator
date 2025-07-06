import { useState, useEffect } from 'react'
import './App.css'
import Input from './Input.jsx'

function App() {

  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    car_make: '',
    car_model: '',
    car_year: '',
    location_origin: '',
    location_destination: ''
  });

  useEffect(() => {
    fetch('http://localhost8000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  const handleForm = (e) => {
    const { name, value } = e.target;
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
      <Input submitHook={handleSubmit} formHook={handleForm} form={formData}/>
  )
}

export default App
