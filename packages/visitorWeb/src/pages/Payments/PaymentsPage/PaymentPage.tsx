import React, { useEffect, useState } from 'react';
import styles from './PaymentPage.module.scss';
import { useTranslation } from 'react-i18next';
import { getCustomer, addCustomer, deletePaymentMethod, getPaymentMethods } from '@src/services/userCalls';
import CreditCard from '../../../components/CreditCard/CreditCard';
import { IPaymentMethod } from '../../../../../shared/models/paymentInterfaces';

const baseURL = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/payments/save/create-checkout-session`;

const PaymentPage = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [customerID, setCustomerId] = useState('');
    const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

    const fetchMethods = async () => {
        try {
            const userToken = localStorage.getItem('user');
            if (userToken === null) { return; }
            const methods = await getPaymentMethods(userToken);
            setPaymentMethods(methods);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchData = async () => {
        try {
            const userToken = localStorage.getItem('user');
            if (userToken === null) { return; }
            const customer = await getCustomer(userToken);
            if (!customer) {
                const newCustomerId = await addCustomer(userToken);
                setCustomerId(newCustomerId);
                setIsLoading(false);
            } else {
                setCustomerId(customer);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    useEffect(() => {
        fetchData();
        fetchMethods()
    }, []);

    return (
        <div className={styles.PaymentPage}>
            <h2 className={styles.heading}>{t('pages.Payment.title')}</h2>
            {isLoading ? (
                <div className={styles.containerLoad}>
                    <p>{t('common.loading')}</p>
                </div>
            ) : (
                <>
                {paymentMethods && paymentMethods.length > 0 ? (
                <div className={styles.creditCardsContainer}>
                    {paymentMethods.map((paymentMethod, index) => (
                        <CreditCard
                            key={index}
                            name={paymentMethod.name}
                            brand={paymentMethod.brand}
                            last4={paymentMethod.last4}
                            exp_month={paymentMethod.exp_month}
                            exp_year={paymentMethod.exp_year}
                            id={paymentMethod.id}
                            onDelete={deletePaymentMethod}
                            onUpdate={fetchMethods}
                        />
                    ))}
                </div>
                ) : (
                    <div className={styles.noPaymentMethods}>
                        {t('pages.Payment.nopay')}
                    </div>
                )}
                <form className={styles.addButton} action={baseURL} method='POST'>
                    <input type='hidden' name='customerId' value={customerID} />
                    <input type='hidden' name='domainURL' value={process.env.VISITOR_URL} />
                    <button type='submit'>
                        {t('pages.Payment.add')}
                    </button>
                </form>
            </>
            )}
        </div>
    );
};

export default PaymentPage;
