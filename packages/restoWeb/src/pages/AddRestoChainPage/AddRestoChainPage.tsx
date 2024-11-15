import React, { useState, useEffect } from 'react';
import { getAllRestaurantChainsByUser } from '@src/services/restoCalls';
import { addRestoChain, deleteRestoChain } from '@src/services/userCalls';
import styles from './AddRestoChainPage.module.scss';
import {useTranslation} from "react-i18next";
import {
  ListItemIcon
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {Popup} from "@src/components/dumpComponents/popup/Popup";

const addRestoChainPage = () => {
  const [newRestoChain, setNewRestoChain] = useState<{name: string}[]>([]);
  const [newRestoChainName, setNewRestoChainName] = useState('');
  const [showRestoChainInput, setShowRestoChainInput] = useState(false);
  const [newRestoChainNameError, setRestoChainNameError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const {t} = useTranslation();
  
  useEffect(() => {
    async function fetchRestoChains() {
      try {
        const userToken = localStorage.getItem('user');
        const restoChains = await getAllRestaurantChainsByUser(userToken);
        updateRestoChains(restoChains.length > 0 ? restoChains : []);
      } catch (error) {
        console.error('Error fetching resto chains:', error);
      }
    }
    fetchRestoChains();
  }, []);
  
  const updateRestoChains = (restoChains: {name: string}[]) => {
    setNewRestoChain(restoChains);
  };

  const handleAddNewRestoChain = () => {
    setShowRestoChainInput(true);
  };

  const handleDeleteRestoChain = async (name: string) => {
    try {
      const userToken = localStorage.getItem('user');
      const returnValue = await deleteRestoChain(userToken, name);
        
      if (returnValue) {
        const index = newRestoChain.findIndex(item => item.name === name);
        if (index !== -1) {
          setNewRestoChain([...newRestoChain.slice(0, index), ...newRestoChain.slice(index + 1)]);
        }
      }
    } catch (error) {
      console.error('Error fetching resto chains:', error);
    }
  };
  
  const handleSaveRestoChain = async () => {
    if (newRestoChainName.trim() === '') {
      if (newRestoChainName.trim() === '') {
        setRestoChainNameError(true);
      }
      return;
    }
      
    setRestoChainNameError(false);

    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      console.log("Error getting user ID");
      return;
    }
      
    const existingRestoChains = newRestoChain.find(restoChain => restoChain.name.toLowerCase() === newRestoChainName.toLowerCase());
    if (existingRestoChains) {
      return;
    }
      
    const updatedRestoChain = [...newRestoChain];
      
    const newRestoChainRecord = { name: newRestoChainName};
    updatedRestoChain.push(newRestoChainRecord);

    // add resto chain
    const returnData = await addRestoChain(userToken, newRestoChainName);

    if (returnData) {
      setNewRestoChain(updatedRestoChain);
    }

    setNewRestoChainName('');
    setShowRestoChainInput(false);
  };

  const handleDeleteClick = (e: any) => {
    e.stopPropagation();
    setShowPopup(true);
  };
  
  return (
    <div className={styles.restoChainContainer}>
      <div className={styles.createRestoChainPage}>
        <div className={styles.restoChainContainers}>
          {newRestoChain.map((restoChain, index) => (
            <div key={index} className={styles.restoChainContainer}>
              <div>{t('pages.AddRestoChain.name')} {restoChain.name}</div>
              <div className={styles.deleteRestoChain} onClick={handleDeleteClick}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
              </div>
              {showPopup && (
                <Popup
                  message={t('components.ProductCard.confirm-delete',
                    {productName: restoChain.name})}
                  onConfirm={() => handleDeleteRestoChain(restoChain.name)}
                  onCancel={() => setShowPopup(false)}
                />
              )}
            </div>
          ))}
          {showRestoChainInput && (
            <div className={styles.restoChainContainer}>
              <input
                type="text"
                placeholder={t('pages.AddRestoChain.name')}
                value={newRestoChainName}
                onChange={(e) => {
                  setNewRestoChainName(e.target.value);
                  setRestoChainNameError(false); 
                }}
                style={{ borderColor: newRestoChainNameError ? 'red' : '' }} 
              />
              <button onClick={handleSaveRestoChain}>{t('common.save')}</button>
            </div>
          )}
          {!showRestoChainInput && (
            <div className={styles.addNewRestoChainBtnContainer}>
              <button onClick={handleAddNewRestoChain}>{t('pages.AddRestoChain.add')}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default addRestoChainPage;
