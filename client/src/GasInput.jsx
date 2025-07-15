import { useState, useEffect } from 'react';

function GasPriceInput({ formHook, form }) {
    return (
        <>
        <label>Gas Price:</label>
        <div style={{position:'relative'}}>
            <input
            type="number"
            name="gas_price"
            value={form.gas_price}
            onChange={formHook}
            step="0.01"
            min="0"
            />
        </div>
        </>
    )
}

function GasInput({ formHook, form }) {
  const [gasType, setGasType] = useState('regular');
  const [gasPrice, setGasPrice] = useState(0);

  return (
    <div>
      <GasPriceInput formHook={formHook} form={form} />
    </div>
  );
}

export default GasInput;