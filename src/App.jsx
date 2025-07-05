import { useState } from 'react'
import './App.css'
import Input from './Input.jsx'

function App() {
  const [formData, setFormData] = useState({
    car_make: '',
    car_model: '',
    car_year: '',
    location_origin: '',
    location_destination: ''
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Handling specific models for car_make
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data: ', formData);
  }

  return (
      <Input submitHook={handleSubmit} formHook={handleForm} form={formData}/>
  )
}

export default App
