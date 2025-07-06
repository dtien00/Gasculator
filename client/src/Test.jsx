function Test({ onChange }) {
  return <input onChange={(e) => onChange(e.target.value)} />;
}

export default Test