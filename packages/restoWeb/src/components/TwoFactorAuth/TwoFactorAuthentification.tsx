import React from 'react';
import {useState} from "react";
import {useTranslation} from "react-i18next";

interface VerificationCodeInputProps {
  onSubmit: (code: string) => void;
  errorMessage: string | null;
}

const VerificationCodeInput: React.FC<VerificationCodeInputProps>
    = ({ onSubmit, errorMessage }) => {
      const [code, setCode] = useState<string>('');
      const [localError, setLocalError] = useState<string | null>(null);
      const { t } = useTranslation();

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
          setLocalError(t('pages.LoginPage.enter-code-error'));
        }
      };

      return (
        <div>
          <input
            type="text"
            value={code}
            onChange={handleChange}
            placeholder={t('pages.LoginPage.enter-code')}
          />
          {(localError || errorMessage) && (
            <p style={{ color: 'red' }}>{localError || errorMessage}</p>
          )}
          <button onClick={handleSubmit} disabled={code.length !== 8}>
            {t('common.submit')}
          </button>
        </div>
      );
    };

export default VerificationCodeInput;
