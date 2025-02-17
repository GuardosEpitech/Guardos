import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Layout from 'shared/components/Layout/Layout';
import axios from 'axios';
import styles from "@src/pages/FeatureRequest/FeatureRequest.module.scss"
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import { getVisitorUserPermission } from '@src/services/permissionsCalls';

interface RequestUser {
    name: string;
    subject: string;
    request: string;
}

const initialRequestState = {
    name: '',
    subject: '',
    request: '',
}

const FeatureRequest = () => {
    const [request, setRequest] = useState<RequestUser>(initialRequestState);
    const [showPopup, setShowPopup] = useState(false);
    const [errorData, setErrorData] = useState({
        name: false,
        subject: false,
        request: false,
    });
    const navigate = useNavigate();
    const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/featureRequest`;
    const {t} = useTranslation();
    const userToken = localStorage.getItem('user');
    const [premium, setPremium] = useState<boolean>(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRequest((prevState) => ({ ...prevState, [name]: value }));
        setErrorData((prevState) => ({ ...prevState, [name]: value === '' }));
    };

    const getPremium = async () => {
        try {
            const permissions = await getVisitorUserPermission(userToken);
            const isPremiumUser = permissions.includes('premiumUser');
            setPremium(isPremiumUser);
        } catch (error) {
            console.error("Error getting permissions: ", error);
        }
    };

    useEffect(() => {
        getPremium();
      }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const hasErrors = Object.keys(request).some(
            (key) => request[key as keyof RequestUser] === ''
        );

        if (hasErrors) {
            setErrorData({
                name: request.name === '',
                subject: request.subject === '',
                request: request.request === '',
            });
            return;
        }

        try {
            const dataStorage = JSON.stringify({
                name: request.name,
                subject: request.subject,
                request: request.request,
                isPremium: premium,
            });
            await axios.post(baseUrl, dataStorage, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setShowPopup(true);
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        } catch (error) {
            console.error(`Error in Post Route: ${error}`);
        }
    };

    return (
        <Layout>
            <div className={styles.requestform}>
                <h2>{t('pages.FeatureRequest.feature-request')}</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label={t('pages.FeatureRequest.name')}
                        name="name"
                        value={request.name}
                        onChange={handleChange}
                        error={errorData.name}
                        helperText={errorData.name && t('pages.FeatureRequest.require-fields')}
                        margin='normal'
                        sx={{ width: 'calc(20% - 8px)', marginRight: '16px' }}
                    />
                    <TextField
                        label={t('pages.FeatureRequest.subject')}
                        name="subject"
                        value={request.subject}
                        onChange={handleChange}
                        error={errorData.subject}
                        helperText={errorData.subject && t('pages.FeatureRequest.require-fields')}
                        margin='normal'
                        sx={{ width: 'calc(20% - 8px)', marginRight: '16px' }}
                    />
                    <TextField
                        label={t('pages.FeatureRequest.request')}
                        name="request"
                        value={request.request}
                        onChange={handleChange}
                        error={errorData.request}
                        helperText={errorData.request && t('pages.FeatureRequest.require-fields')}
                        margin='normal'
                        multiline
                        rows={13}
                        sx={{ width: '100%', minHeight: '200px' }}
                    />
                    <Button type="submit" variant="contained" color="primary" size='large'>
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
    );
};

export default FeatureRequest;
