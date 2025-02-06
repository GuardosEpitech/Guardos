import React, { useState, useEffect } from "react";
import styles from "./SubscriptionPage.module.scss";
import {
  addRestoUserPermissions,
  getRestoUserPermission,
  removeRestoUserPermissions
} from "@src/services/permissionsCalls";
import {
  getSubscriptionTime,
  createSubscription,
  getSubscriptionID,
  deleteSubscription,
  deleteSubscriptionTime,
  addActiveSubscription,
  getActiveSubscription,
  addSubscriptionTime
} from "@src/services/userCalls";
import SubscriptionBox from "@src/components/SubscriptionBox/SubscriptionBox";
import {useTranslation} from "react-i18next";
import Layout from 'shared/components/Layout/Layout';

const SubscriptionPage: React.FC = () => {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userSubscriptionTime, setUserSubscriptionTime] = useState<Date>(null);
  const [activeSubscriptionName, setActiveSubscriptionName] = useState<string>('default');
  const {t} = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = localStorage.getItem('user');
        if (userToken === null) {
          return;
        }

        const permissions = await getRestoUserPermission(userToken);
        const userSubscribeTime = await getSubscriptionTime(userToken);
        setUserPermissions(permissions || []);
        setUserSubscriptionTime(userSubscribeTime ? new Date(userSubscribeTime) : null);
        console.log(userSubscribeTime);

        if (userSubscribeTime) {
          const subscriptionDate = new Date(userSubscribeTime);
          const currentDate = new Date();
          const oneMonthAgo = new Date(currentDate);
          oneMonthAgo.setMonth(currentDate.getMonth() - 1);

          const activeSubscriptionName = await getActiveSubscription(userToken);
          setActiveSubscriptionName(activeSubscriptionName);

          if (subscriptionDate <= oneMonthAgo) {
            await deleteSubscriptionTime(userToken);
            setUserSubscriptionTime(null);
            await addActiveSubscription(userToken, permissions[0]);
          } else {
            setUserSubscriptionTime(subscriptionDate);
          }
        } else {
          setUserSubscriptionTime(null);
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddPermission = async (permission: string[]) => {
    try {
      const userToken = localStorage.getItem('user');
      if (userToken === null) {
        return;
      }

      await addRestoUserPermissions(userToken, permission);

      let subscriptionID = await getSubscriptionID(userToken);

      if (subscriptionID && permission[0] !== 'default') {
        await deleteSubscription(userToken, subscriptionID);
      }
      
      if (permission[0] === 'basicSubscription') {
        await createSubscription(userToken, 'price_1PvaFWP2Z8f8T9hwM0fnZkdT');
        await addActiveSubscription(userToken, permission[0]);
        if (!userSubscriptionTime) {
          await addSubscriptionTime(userToken);
          const userSubscribeTime = await getSubscriptionTime(userToken);
          setUserSubscriptionTime(new Date(userSubscribeTime))
        }
        setActiveSubscriptionName(permission[0]);
      } else if (permission[0] === 'premiumUser') {
        await createSubscription(userToken, 'price_1PvaG4P2Z8f8T9hwoor77WPU');
        await addActiveSubscription(userToken, permission[0]); 
        if (!userSubscriptionTime) {
          await addSubscriptionTime(userToken);
          const userSubscribeTime = await getSubscriptionTime(userToken);
          setUserSubscriptionTime(new Date(userSubscribeTime))
        }
        setActiveSubscriptionName(permission[0]);         
      }

      const permissions = await getRestoUserPermission(userToken);
      setUserPermissions(permissions || []);
    } catch (error) {
      console.error("Error adding user permissions:", error);
    }
  };

  const handleRemovePermission = async (permission: string[]) => {
    try {
      const userToken = localStorage.getItem('user');
      if (userToken === null) {
        return;
      }

      await removeRestoUserPermissions(userToken, permission);
      const permissions = await getRestoUserPermission(userToken);
      setUserPermissions(permissions || []);
    } catch (error) {
      console.error("Error removing user permissions:", error);
    }
  };

  const handleSwitchPermissions = async (permission: string[]) => {
    await handleRemovePermission(userPermissions);
    await handleAddPermission(permission);
    setUserPermissions(permission);
  };

  // Format date to German time format (DD.MM.YYYY)
  const formattedSubscriptionTime = userSubscriptionTime
    ? new Intl.DateTimeFormat('de-DE').format(userSubscriptionTime)
    : t('pages.SubscriptionPage.no-subscription');

  return (
    <Layout>
      <div className={styles.userPermissionsContainer}>
        <h1>{t('pages.SubscriptionPage.my-subscription')}</h1>
        <div className={styles.subscriptionContainer}>
          <SubscriptionBox
            title={t('pages.SubscriptionPage.free')}
            description={[
              t('pages.SubscriptionPage.free-description')
            ]}
            price="0.00 €"
            onClick={handleSwitchPermissions}
            isActive={
              userPermissions.includes("default") || userPermissions.length === 0
            }
            permission={"default"}
          />
          <SubscriptionBox
            title={t('pages.SubscriptionPage.basic')}
            description={[
              t('pages.SubscriptionPage.description-low-level-1'),
              t('pages.SubscriptionPage.description-low-level-2')
            ]}
            price="2.99 €"
            onClick={handleSwitchPermissions}
            isActive={userPermissions.includes("basicSubscription")}
            permission={"basicSubscription"}
            onDelete={handleRemovePermission}
          />
          <SubscriptionBox
            title={t('pages.SubscriptionPage.premium')}
            description={[
              t('pages.SubscriptionPage.description-low-level-1'),
              t('pages.SubscriptionPage.description-low-level-2'),
              t('pages.SubscriptionPage.description-high-level-1'),
              t('pages.SubscriptionPage.description-high-level-2'),
              t('pages.SubscriptionPage.description-high-level-3')
            ]}
            price="4.99 €"
            onClick={handleSwitchPermissions}
            isActive={userPermissions.includes("premiumUser")}
            permission={"premiumUser"}
            onDelete={handleRemovePermission}
          />
        </div>
        {/* Add the subscription time textbox */}
        <div className={styles.subscriptionTimeContainer}>
          <label htmlFor="subscriptionTime" className={styles.subscriptionTimeLabel}>
            {t('pages.SubscriptionPage.subscription-time')}
          </label>
          <input
            type="text"
            id="subscriptionTime"
            value={formattedSubscriptionTime}
            readOnly
            className={styles.subscriptionTimeInput}
          />
        </div>
        {/* Add the subscription time textbox */}
        <div className={styles.subscriptionTimeContainer}>
          <label htmlFor="subscriptionActive" className={styles.subscriptionActiveLabel}>
            {t('pages.SubscriptionPage.subscription-active')}
          </label>
          <input
            type="text"
            id="subscriptionActive"
            value={activeSubscriptionName}
            readOnly
            className={styles.subscriptionActiveInput}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;
