import React from "react";
import ReactDOM from 'react-dom';
import styles from "./Popup.module.scss";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

type PopupProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 200px;
  background-color: white;
  outline: #6d071a solid 2px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  will-change: transform; /* Ensure smooth rendering */
  z-index: 9999; /* Ensure it stays above other elements */
`;

const PopupButton = styled.button`
  margin: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  background-color: #6d071a;
  color: white;
  font-size: 16px;
  cursor: pointer;
` as React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export const Popup: React.FC<PopupProps> = ({ message, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return ReactDOM.createPortal(
    <PopupContainer>
      <div className={styles.PopupText}>{message}</div>
      <div>
        <PopupButton onClick={onConfirm}>{t('common.confirm')}</PopupButton>
        <PopupButton onClick={onCancel}>{t('common.cancel')}</PopupButton>
      </div>
    </PopupContainer>,
    document.body // Render outside the app hierarchy
  );
};
