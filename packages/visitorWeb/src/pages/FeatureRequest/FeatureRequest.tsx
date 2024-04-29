import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Layout from 'shared/components/Layout/Layout';
import axios from 'axios';
import styles from "@src/pages/FeatureRequest/FeatureRequest.module.scss"
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

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
    const navigate = useNavigate();
    const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/featureRequest`;
    const {t} = useTranslation();

    useEffect(() => {
        checkDarkMode();
      }, []);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRequest((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const dataStorage = JSON.stringify({
                name: request.name,
                subject: request.subject,
                request: request.request
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
                            value={request.name}
                            onChange={handleChange}
                            margin='normal'
                            sx={{ width: 'calc(20% - 8px)', marginRight: '16px' }}
                        />
                        <TextField
                            label={t('pages.FeatureRequest.subject')}
                            name="subject"
                            value={request.subject}
                            onChange={handleChange}
                            margin='normal'
                            sx={{ width: 'calc(20% - 8px)', marginRight: '16px' }}
                        />
                        <TextField
                            label={t('pages.FeatureRequest.request')}
                            name="request"
                            value={request.request}
                            onChange={handleChange}
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
        </>
    );
};

export default FeatureRequest;
