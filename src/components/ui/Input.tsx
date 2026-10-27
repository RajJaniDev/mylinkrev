import React, { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id || generatedId;
    return (
      <div className="input-group">
        {label && <label className="input-label" htmlFor={inputId}>{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={`input-field ${className}`}
          {...props}
        />
        {error && <span style={{ color: "red", fontSize: "0.875rem" }}>{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
