import React, { useState, useEffect } from "react";
import styles from "./SubscriptionPage.module.scss";
import {
  addVisitorUserPermissions,
  getVisitorUserPermission,
  removeVisitorUserPermissions
} from "@src/services/permissionsCalls";
import SubscriptionBox from "@src/components/SubscriptionBox/SubscriptionBox";
import {useTranslation} from "react-i18next";
import Layout from 'shared/components/Layout/Layout';

const SubscriptionPage: React.FC = () => {
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const {t} = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = localStorage.getItem('user');
        if (userToken === null) {
          return;
        }

        const permissions = await getVisitorUserPermission(userToken);
        setUserPermissions(permissions || []);
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

      await addVisitorUserPermissions(userToken, permission);
      const permissions = await getVisitorUserPermission(userToken);
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

      await removeVisitorUserPermissions(userToken, permission);
      const permissions = await getVisitorUserPermission(userToken);
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
              t('pages.SubscriptionPage.description-high-level-2')
            ]}
            price="5.99 €"
            onClick={handleSwitchPermissions}
            isActive={userPermissions.includes("premiumUser")}
            permission={"premiumUser"}
            onDelete={handleRemovePermission}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;
