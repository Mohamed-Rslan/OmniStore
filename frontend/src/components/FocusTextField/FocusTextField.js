import React, { useState, useRef, useEffect } from 'react';
import { TextField } from '@mui/material';

/**
 * A TextField component that maintains focus during input
 * This solves the issue where text fields lose focus after each character entry
 */
const FocusTextField = ({ value: propValue, onChange, ...props }) => {
  // Use local state to manage the value during typing
  const [localValue, setLocalValue] = useState(propValue);
  const inputRef = useRef(null);
  
  // Update local value when prop value changes (from outside)
  useEffect(() => {
    setLocalValue(propValue);
  }, [propValue]);

  // Handle local changes without losing focus
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Notify the parent component
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <TextField
      {...props}
      value={localValue}
      onChange={handleChange}
      inputRef={inputRef}
      autoComplete="off"
    />
  );
};

export default FocusTextField;
