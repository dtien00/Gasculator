import { useState, useEffect } from 'react'

function Input({ form_value, handleChange, disabled, suggestions, name, placeholder, id_flag }) {
  const options = suggestions || [] // Default to an empty array if no suggestions are provided

  return (
    <select name={name} value={form_value} onChange={handleChange} disabled={disabled}>
        <option value="" disabled>{placeholder}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {id_flag ? option.text:option.value}
        </option>
      ))}
    </select>
  );
}

function CarInput({ handleForm, form }) {
  
  const [carYear, setCarYear] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carMakeSuggestions, setCarMakeSuggestions] = useState([]);
  const [carModel, setCarModel] = useState('');
  const [carModelSuggestions, setCarModelSuggestions] = useState([]);
  const [carOption, setCarOption] = useState('');
  const [carOptionSuggestions, setCarOptionSuggestions] = useState([]);
  // Currently no error handling for fetching suggestions. Should add error state later.

  const year_start = 1984;
  const year_end = new Date().getFullYear();
  const years = Array.from({ length: year_end - year_start + 1 }, (_, i) => year_start + i);
  const formattedYears = years.map(year => ({ value: year }));


  useEffect(() => {
    // react to any changes in car make, model, or year
    // Requests to https://www.fueleconomy.gov/feg/ws/ MUST follow the provided path:
      // Year -> Make -> Model -> Options

    const fetchCarData = async(endpoint, params = {}) => {
      try {
        const urlParams = new URLSearchParams(params);
        const response = await fetch(`http://localhost:8000/${endpoint}?${urlParams}`);
        const xmlStr = await response.text()
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, "application/xml");

        const options = [...xmlDoc.querySelectorAll("menuItem")].map(item => ({
          value: item.querySelector("value")?.textContent,
          text: item.querySelector("text")?.textContent
        }));
        console.log("Options:", options);
        return options;
      }
      catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to fetch suggestions');
      }
    }

    // Individual fetch functions using the generic helper
    const fetchCarMakes = async () => {
      const options = await fetchCarData('search-car-makes', { carYear });
      setCarMakeSuggestions(options);
    }
    const fetchCarModels = async () => {
      const options = await fetchCarData('search-car-models', { carYear, carMake });
      setCarModelSuggestions(options);
    }
    const fetchCarOptions = async () => {
      const options = await fetchCarData('search-car-options', { carYear, carMake, carModel });
      setCarOptionSuggestions(options);
    }

    // Determine which function to call based on available data
    if (carYear && carMake && carModel) {
      console.log("Y M Mo")
      fetchCarOptions();
    } else if (carYear && carMake) {
      console.log("Y M")
      resetCarModelData();
      fetchCarModels();
    } else if (carYear) {
      console.log("Y")
      resetCarMakeData();
      fetchCarMakes();
    }

  }, [carOption, carModel, carMake, carYear]);

  const resetCarOptionData = () => {
    setCarOption('');
    setCarOptionSuggestions([]);
    const blankFormOption = {target: {name: "car_option", value: ""}};
    handleForm(blankFormOption);
  }

  const resetCarModelData = () => {
    setCarModel('');
    setCarModelSuggestions([]);
    const blankFormModel = {target: {name: "car_model", value: ""}};
    handleForm(blankFormModel);
    resetCarOptionData();
  }

  const resetCarMakeData = () => {
    setCarMake('');
    setCarMakeSuggestions([]);
    const blankFormMake = {target: {name: "car_make", value: ""}};
    handleForm(blankFormMake);
    resetCarModelData();
  }

  const handleInputChange = (e, s) => {
    // Update the specific state based on the input type
    switch (s){
      case 'year':
        setCarYear(e.target.value)
        resetCarMakeData(); // Reset make and model suggestions when year changes
        break;
      case 'make':
        setCarMake(e.target.value)
        resetCarModelData(); // Reset model suggestions when make changes
        break;
      case 'model':
        setCarModel(e.target.value)
        resetCarOptionData(); // Reset options when model changes
        break;
      case 'option':
        setCarOption(e.target.value)
        break;
    }
    handleForm(e)
  }

  return (
    <form onSubmit={null} className="car-input-form" 
        style={{  
          paddingLeft: '15px',
          paddingRight: '15px',
          paddingTop: '15px', 
          border: '2px solid aquamarine', 
          borderRadius: '10px'
        }}>

          {/* Car Make, Year, and Model Inputs */}
        <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '10px'
              }}>
              <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  right: '20px'
              }}>
                  <label>Year:</label>
                  <Input form_value={form.car_year} handleChange={(e) => {handleInputChange(e, 'year')}} disabled={false} suggestions={formattedYears} name={"car_year"} placeholder={"Select car year..."}/>
              </div>
              <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
              }}>
                  <label>Make:</label>
                  <Input form_value={form.car_make} handleChange={(e) => {handleInputChange(e, 'make')}} disabled={carYear ? false : true} suggestions={carMakeSuggestions} name={"car_make"} placeholder={"Select car make..."}/>
              </div>
        </div>

        <label>Model:</label>
        <div style={{}}>
            <Input form_value={form.car_model} handleChange={(e) => {handleInputChange(e, 'model')}} disabled={carMake ? false : true} suggestions={carModelSuggestions} name={"car_model"} placeholder={"Select car model..."}/>
        </div>
        <br/>

        <label>Options:</label>
        <div>
          <Input form_value={form.car_option} handleChange={(e) => {handleInputChange(e, 'option')}} disabled={carModel ? false : true} suggestions={carOptionSuggestions} name={"car_option"} placeholder={"Select an option"} id_flag={true}/>
        </div>
    </form>
  );
}

export default CarInput