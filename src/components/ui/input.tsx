import React from 'react';

export const Input: React.FC<{
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  className?: string;
  disabled?: boolean;
}> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
  className = '',
  disabled = false,
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min={min}
    max={max}
    disabled={disabled}
    className={`px-3 py-2 border border-gray-300 rounded font-normal text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
  />
);
