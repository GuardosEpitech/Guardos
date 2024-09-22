import React, { useEffect, useState } from 'react';
import styles from './AddressInput.module.scss';
import {useTranslation} from "react-i18next";

interface AddressInputProps {
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    handleAddressSearch: () => Promise<void>;
    isAddress: boolean;
  }
  
  const AddressInput: React.FC<AddressInputProps> = ({
    address,
    setAddress,
    handleAddressSearch,
    isAddress,
  }) => {
    const { t } = useTranslation();
  
    return (
      <div className={styles.addressInputContainer}>
        <input
          type="text"
          className={styles.addressInput}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t('pages.RestoPage.address')}
        />
        <button
          className={isAddress ? styles.addressButtonTrue : styles.addressButton}
          onClick={handleAddressSearch}
        >
          {t('pages.RestoPage.loc')}
        </button>
      </div>
    );
  };

export default AddressInput;