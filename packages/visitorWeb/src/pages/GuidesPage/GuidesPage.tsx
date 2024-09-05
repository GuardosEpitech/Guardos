import React, { useEffect } from 'react';
import styles from './GuidesPage.module.scss';
import Layout from 'shared/components/Layout/Layout';
import Accordion from "@src/components/Accordion/Accordion";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { checkDarkMode } from "@src/utils/DarkMode";

const BtnTheme = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Calibri",
        textTransform: "none",
        fontSize: "1.13rem",
        fontWeight: "500",
      },
    },
    palette: {
      primary: {
        main: "#6d071a",
        contrastText: "#ffffff",
      },
    },
    shape: {
      borderRadius: 5,
    },
  });
};

interface Tip {
  title: string;
  content: string;
}

const GuidesPage = () => {
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

  return (
    <>
      <Layout>
        <div className={styles.GuidePage}>
          <div className={styles.HeaderSection}>
            <h1>{t('pages.GuidePage.title')}</h1>
            <p>{t('pages.GuidePage.description')}</p>
          </div>

          {/* Allergen Tips Section */}
          <div className={styles.TipsSection}>
            <h2>{t('pages.GuidePage.tipsTitle')}</h2>
            {(t('pages.GuidePage.tips', { returnObjects: true }) as Tip[]).map((tip, index) => (
              <Accordion key={index} title={tip.title}>
                <p>{tip.content}</p>
              </Accordion>
            ))}
          </div>

          {/* Allergen Prevention and Alternatives Section */}
          <div className={styles.PreventionSection}>
            <h2>{t('pages.GuidePage.preventionTitle')}</h2>
            <p>{t('pages.GuidePage.preventionDescription')}</p>
            {(t('pages.GuidePage.prevention', { returnObjects: true }) as Tip[]).map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p>{item.content}</p>
              </Accordion>
            ))}
            <br/>
            <ThemeProvider theme={BtnTheme()}>
              <Button variant="outlined">
                <a href={"https://inspection.canada.ca/en/preventive-controls/food-allergens-gluten-and-added-sulphites"}>
                  {t('pages.GuidePage.learnMore')}
                </a>
              </Button>
            </ThemeProvider>
          </div>

          {/* FAQ Section */}
          <div className={styles.FAQSection}>
            <h2>{t('pages.GuidePage.faqTitle')}</h2>
            {(t('pages.GuidePage.faq', { returnObjects: true }) as Tip[]).map((item, index) => (
              <Accordion key={index} title={item.title}>
                <p>{item.content}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default GuidesPage;
