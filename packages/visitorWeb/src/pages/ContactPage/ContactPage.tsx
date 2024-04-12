import React, { useState, useEffect } from "react";
import styles from "./ContactPage.module.scss";
import PlaceIcon from "@mui/icons-material/Place";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import axios from 'axios';
import {useTranslation} from "react-i18next";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/sendEmail/`;

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const {t} = useTranslation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      
        if (name && email && subject && message && isValidEmail(email)) {
          try {
            const response = await axios({
                method: 'POST',
                url: baseUrl,
                data: {
                    name,
                    email,
                    subject,
                    message,
                  },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
      
            if (response.status >= 200 && response.status < 300) {
              console.log('Backend response:', response.data);
      
              setShowConfirmation(true);
      
              setName('');
              setEmail('');
              setSubject('');
              setMessage('');
      
              setTimeout(() => {
                setShowConfirmation(false);
              }, 3000);
            } else {
              console.error('Backend responded with an error:', response.data);
            }
          } catch (error) {
            console.error('Error sending data to the backend:', error);
          }
        }
      };

    const isValidEmail = (value: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      };

    return (
        <div>
            <section className={styles.contact}>
                <div className={styles.content}>
                    <h2>{t('pages.ContactPage.contact-us')}</h2>
                    <p>{t('pages.ContactPage.reach-out')}</p>
                </div>
                <div className={styles.container}>
                    <div className={styles.contactInfo}>
                        <div className={styles.box}>
                            <div className={styles.icon}>
                                <PlaceIcon />
                            </div>
                            <div className={styles.text}>
                                <h3>{t('pages.ContactPage.address')}</h3>
                                <p>Fasanenstraße 86,<br/>10623 Berlin,<br/>{t('pages.ContactPage.germany')}</p>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.icon}>
                                <PhoneIcon />
                            </div>
                            <div className={styles.text}>
                                <h3>{t('pages.ContactPage.phone')}</h3>
                                <p>030 1234567</p>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <div className={styles.icon}>
                                <EmailIcon />
                            </div>
                            <div className={styles.text}>
                                <h3>{t('pages.ContactPage.email')}</h3>
                                <p>guardos-help@outlook.com</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.contactForm}>
                        <form onSubmit={handleSubmit}>
                            <h2>{t('pages.ContactPage.send-msg')}</h2>
                            <div className={styles.inputBox}>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <span>{t('pages.ContactPage.full-name')}</span>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <span>{t('pages.ContactPage.email')}</span>
                            </div>
                            <div className={styles.inputBox}>
                                <input
                                    type="text"
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                                <span>{t('pages.ContactPage.subject')}</span>
                            </div>
                            <div className={styles.inputBox}>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <span>{t('pages.ContactPage.message')}</span>
                            </div>
                            <div className={styles.inputBox}>
                                <input type="submit" id="send" name="" value="Send"></input>
                            </div>
                        </form>
                    </div>
                    {showConfirmation && (
                    <div className={styles.confirmationPopup}>
                        <p>{t('pages.ContactPage.msg-sent-success')}</p>
                    </div>
                    )}
                </div>
            </section>
        </div>
    )
};

export default ContactPage;
