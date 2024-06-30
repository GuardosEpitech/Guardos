import React, { useEffect, useState } from 'react';
import styles from './T&CPage.module.scss';
import {useTranslation} from "react-i18next";


const TermsPage: React.FC = () => {
  const {t} = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('pages.T&C.title')}</h2>
        <hr className={styles.line} />
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.intro')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.introTxt')}</p>
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.definitions')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <ul className={styles.indentedList}>
            <li>{t('pages.T&C.service')}</li>
            <li>{t('pages.T&C.user')}</li>
            <li>{t('pages.T&C.profile')}</li>
            <li>{t('pages.T&C.content')}</li>
            <li>{t('pages.T&C.premium')}</li>
          </ul>
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.responibilities')}</h2>
        <hr className={styles.line} />
        <h2 className={styles.title}>{t('pages.T&C.reg')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.regTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.conduct')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.conductTxt')}</p>
          <br />
          <ul className={styles.indentedList}>
            <li>{t('pages.T&C.conductOpt1')}</li>
            <li>{t('pages.T&C.conductOpt2')}</li>
            <li>{t('pages.T&C.conductOpt3')}</li>
          </ul>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.upload')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.uploadTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.payment')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.paymentTxt')}</p>
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.property')}</h2>
        <hr className={styles.line} />
        <h2 className={styles.title}>{t('pages.T&C.ownership')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.ownershipTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.license')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.licenseTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.restriction')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.restrictionTxt')}</p>
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.privacy')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.privacyTxt')}</p>
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.diclaimer')}</h2>
        <hr className={styles.line} />
        <h2 className={styles.title}>{t('pages.T&C.serviceAvailability')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.availabilityTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.thirdParty')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.thirdPartyTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.warranty')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.warrantyTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.limit')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.limitTxt')}</p>
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.termination')}</h2>
        <hr className={styles.line} />
        <h2 className={styles.title}>{t('pages.T&C.right')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.rightTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.effect')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.effectTxt')}</p>
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.law')}</h2>
        <hr className={styles.line} />
        <h2 className={styles.title}>{t('pages.T&C.jurisdiction')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.jurisdictionTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.dispute')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.disputeTxt')}</p>
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.contact')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.contactTxt')}</p>
          <br />
          <p>{t('pages.T&C.name')}</p>
          <p>{t('pages.T&C.address')}</p>
          <p>{t('pages.T&C.email')}
            <a href='/contact'>{t('pages.T&C.email1')}</a>
          </p>
          <br />
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.app')}</h2>
        <hr className={styles.line} />
        <h2 className={styles.title}>{t('pages.T&C.purchase')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.purchaseTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.appTerms')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.appTermsTxt')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.T&C.device')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.deviceTxt')}</p>
        </div>
        <br/>
        <h2 className={styles.title}>{t('pages.T&C.update')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.T&C.updateTxt')}</p>
        </div>
        <br/>
      </div>
    </div>
  );
};

export default TermsPage;