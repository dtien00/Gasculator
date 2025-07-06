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

function Input({ submitHook, formHook, form }) {
  return (
    <form onSubmit={submitHook}>
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
          <input type="text" name="location_origin" value={form.location_origin} onChange={formHook}/>
          <button>Locate Me</button>
        </label>
        <br/>
        <label>
          Destination:
          <input type="text" name="location_destination" value={form.location_destination} onChange={formHook}/>
        </label>
        <br/>
        <br/>
        <button type="submit">Calculate</button>
    </form>
  )
}

export default Input;