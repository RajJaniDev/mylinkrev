import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="input-group">
        {label && <label className="input-label">{label}</label>}
        <input 
          ref={ref} 
          className={`input-field ${className}`} 
          {...props} 
        />
        {error && <span style={{ color: "red", fontSize: "0.875rem" }}>{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
