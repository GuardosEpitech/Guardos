import React, {useEffect, useState} from "react";
import { TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Layout from 'shared/components/Layout/Layout';
import axios from 'axios';
import styles from "@src/pages/FeatureRequest/FeatureRequest.module.scss"
import {useTranslation} from "react-i18next";
import { getRestoUserPermission } from "@src/services/permissionsCalls";

interface RequestUser {
  name: string;
  subject: string;
  request: string;
}

const initialRequestState = {
  name: '',
  subject: '',
  request: '',
};

const FeatureRequest = () => {
  const [request, setRequest] = useState<RequestUser>(initialRequestState);
  const [showPopup, setShowPopup] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const [invalidSubject, setInvalidSubject] = useState(false);
  const [invalidRequest, setInvalidRequest] = useState(false);
  const navigate = useNavigate();
  const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/featureRequest`;
  const {t} = useTranslation();
  const [premium, setPremium] = useState<boolean>(false);
  const userToken = localStorage.getItem('user');
  const [errorData, setErrorData] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setRequest((prevState) => ({...prevState, [name]: value}));
  };

  const getPremium = async () => {
    try {
      const permissions = await getRestoUserPermission(userToken);
      const isPremiumUser = permissions.includes('premiumUser');
      if (isPremiumUser) {
        setPremium(true);
      } else {
        setPremium(false);
      }
    } catch (error) {
      console.error("Error getting permissions: ", error);
    }
  }

  useEffect(() => {
    getPremium();
  }, []);

      
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInvalidName(false);
    setInvalidSubject(false);
    setInvalidRequest(false);

    try {
      if (!request.name) {
        setInvalidName(true);
      }
      if (!request.subject) {
        setInvalidSubject(true);
      }
      if (!request.request) {
        setInvalidRequest(true);
      }
      if (!request.name || !request.subject || !request.request) {
        return;
      }

      const dataStorage = JSON.stringify({
        name: request.name,
        subject: request.subject,
        request: request.request,
        isPremium: premium,
      });
      await axios({
        method: 'POST',
        url: baseUrl,
        data: dataStorage,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setShowPopup(true); // Show pop-up after successful submission
      // Redirect to previous page after 2 seconds
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error(`Error in Post Route: ${error}`);
      throw error;
    }
  };

  return (
    <>
      <Layout>
        <div className={styles.requestform}>
          <h2>{t('pages.FeatureRequest.feature-request')}</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label={t('pages.FeatureRequest.name')}
              name="name"
              error={invalidName}
              helperText={invalidName ?
                t('pages.UserSupport.require-field') : ""}
              value={request.name}
              onChange={handleChange}
              margin='normal'
              sx={{width: 'calc(20% - 8px)', marginRight: '16px'}}
            />
            <TextField
              label={t('pages.FeatureRequest.subject')}
              name="subject"
              error={invalidSubject}
              helperText={invalidSubject ?
                t('pages.UserSupport.require-field') : ""}
              value={request.subject}
              onChange={handleChange}
              margin='normal'
              sx={{width: 'calc(20% - 8px)', marginRight: '16px'}}
            />
            <TextField
              label={t('pages.FeatureRequest.request')}
              name="request"
              error={invalidRequest}
              helperText={invalidRequest ?
                t('pages.UserSupport.require-field') : ""}
              value={request.request}
              onChange={handleChange}
              margin='normal'
              multiline
              rows={13}
              sx={{width: '100%', minHeight: '200px'}}
            />
            {errorData &&
                <span style={{color: "red"}}>{t('pages.FeatureRequest.require-fields')}</span>
            }
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size='large'
            >
              {t('common.submit')}
            </Button>
          </form>
        </div>
        {showPopup && (
          <div className={styles.popup}>
            <p>{t('pages.FeatureRequest.email-sent-success')}</p>
          </div>
        )}
      </Layout>
    </>
  );
};

export default FeatureRequest;
