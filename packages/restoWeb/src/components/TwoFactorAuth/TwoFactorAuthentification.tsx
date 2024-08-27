import React from 'react';
import {useState} from "react";

interface VerificationCodeInputProps {
  onSubmit: (code: string) => void;
  errorMessage: string | null;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps>
    = ({ onSubmit, errorMessage }) => {
      const [code, setCode] = useState<string>('');
      const [localError, setLocalError] = useState<string | null>(null);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 8) {
          setCode(value);
          setLocalError(null);
        }
      };

      const handleSubmit = () => {
        if (code.length === 8) {
          onSubmit(code);
        } else {
          setLocalError('Please enter an 8-digit code');
        }
      };

      return (
        <div>
          <input
            type="text"
            value={code}
            onChange={handleChange}
            placeholder="Enter 8-digit code"
          />
          {(localError || errorMessage) && (
            <p style={{ color: 'red' }}>{localError || errorMessage}</p>
          )}
          <button onClick={handleSubmit} disabled={code.length !== 8}>
          Submit
          </button>
        </div>
      );
    };

export default VerificationCodeInput;
