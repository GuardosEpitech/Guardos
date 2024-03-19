import React, { useState, useRef } from 'react';
import { Card, CardContent, Container, Button, List, ListItem, ListItemText, Typography, Box, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { NavigateTo } from "@src/utils/NavigateTo";
import Layout from 'shared/components/Layout/Layout';
import axios from 'axios';
import styles from "@src/pages/FeatureRequest/FeatureRequest.module.scss"


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
    const [request, setUser] = useState<RequestUser>(initialRequestState);
    const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/featureRequest`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevState) => ({ ...prevState, [name]: value }));
      };

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const dataStorage = JSON.stringify({
            name: request.name,
            subject: request.subject,
            request: request.request
          });
          const response = await axios({
              method: 'POST',
              url: baseUrl,
              data: dataStorage,
              headers: {
                  'Content-Type': 'application/json',
              },
          });
        } catch (error) {
          console.error(`Error in Post Route: ${error}`);
          throw error;
      }
    };

    return (
    <>
      <Layout>
        <div className={styles.requestform}>
          <h2>Feature Request</h2>
          <form onSubmit={handleSubmit}>
            <TextField 
              label="Name" 
              name="name"
              value={request.name}
              onChange={handleChange}
              margin='normal'
              sx={{ width: 'calc(20% - 8px)', marginRight: '16px' }} 
            />
            <TextField 
              label="Subject"        
              name="subject"
              value={request.subject}
              onChange={handleChange}
              margin='normal'
              sx={{ width: 'calc(20% - 8px)', marginRight: '16px' }}
            />
            <TextField 
              label="Your request"       
              name="request"
              value={request.request}
              onChange={handleChange}
              margin='normal'
              multiline
              rows={13}
              sx={{ width: '100%', minHeight: '200px' }}
            />
            <Button type="submit" variant="contained" color="primary" size='large'>
              Submit
            </Button>
        </form>
        </div>
      </Layout>
    </>
    );
};

export default FeatureRequest;