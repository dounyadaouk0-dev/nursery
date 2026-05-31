function Input({ placeholder, type = "text", onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      style={{
        display: "block",
        margin: "10px 0",
        padding: "8px",
        width: "250px"
      }}
    />
  );
}

export default Input;