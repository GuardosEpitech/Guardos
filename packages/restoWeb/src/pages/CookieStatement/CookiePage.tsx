import React, { useEffect, useState } from 'react';
import styles from './CookiePage.module.scss';
import {useTranslation} from "react-i18next";
import Switch from "@mui/material/Switch";
import { 
  setUserRestoPreferences, 
  getUserRestoPreferences 
} from '../../services/profileCalls';

type SliderButtonProps = {
  name: string;
  isActive: boolean;
  onClick: () => void;
};

const SliderButton: React.FC<SliderButtonProps> = ({
  name,
  isActive,
  onClick
}) => {
  return (
      <div className={styles["slider-button"]}>
      <span>{name}</span>
      {name === "Strictly necessary" ? (
        <Switch
          checked={true}
          disabled={true}
          color="primary"
          className={styles["switch"]}
        />
      ) : (
        <Switch
          checked={isActive}
          onChange={onClick}
          color="primary"
          className={styles["switch"]}
        />
      )}
    </div>
  );
};


const CookieStatementPage: React.FC = () => {
  const [sliderButtons, setSliderButtons] = useState([
    { name: "Functional", isActive: false },
    { name: "Statistical", isActive: false },
    { name: "Marketing", isActive: false },
  ]);
  const {t} = useTranslation();

  const fetchUserPreference = async () => {
    const userToken = localStorage.getItem("user");
    if (userToken === null) {
      return;
    }
    const data = await getUserRestoPreferences(userToken);
    console.log(data);
    setSliderButtons(prevState => [
      { name: "Functional", isActive: data.functional },
      { name: "Statistical", isActive: data.statistical },
      { name: "Marketing", isActive: data.marketing },
    ]);
  }

  useEffect(() => {
    fetchUserPreference();
  }, []);

  const updateCookies = async (index: number) => {
    setSliderButtons((prevSliderButtons) =>
    prevSliderButtons.map((button, i) =>
      i === index ? { ...button, isActive: !button.isActive } : button
    )
  );

  const userToken = localStorage.getItem("user");
  if (userToken === null) {
    return;
  }

  const updatedSliderButtons = [...sliderButtons];
  updatedSliderButtons[index].isActive = !updatedSliderButtons[index].isActive; 

  const response = await setUserRestoPreferences(userToken, {
    functional: updatedSliderButtons[0].isActive,
    statistical: updatedSliderButtons[1].isActive,
    marketing: updatedSliderButtons[2].isActive,
  });

  };



  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('pages.CookieStatement.title')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.CookieStatement.intro')} <a href='/privacystatement'>{t('pages.CookieStatement.privacy')}</a>.</p>
          <br />
          <p>{t('pages.CookieStatement.intro2')}</p>
          <br />
          <p>{t('pages.CookieStatement.intro3')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.CookieStatement.EnableDisable')}</h2>
        <hr className={styles.line} />
        <br />
        <div className={styles["slider-container"]}>
              {sliderButtons.map((button, index) => (
                <SliderButton
                key={button.name}
                name={button.name}
                isActive={button.isActive}
                onClick={() => updateCookies(index)}
                />
            ))}
            </div>
        <div className={styles.text}>
          <p>{t('pages.CookieStatement.cookies')}<a href='/technologies'>{t('pages.CookieStatement.listOf')}</a>. {t('pages.CookieStatement.cookies2')}</p>

        </div>
        <h2 className={styles.title}>{t('pages.CookieStatement.WhichTech')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.CookieStatement.introTech')}</p>
          <br />
          <p className={styles.italic}>{t('pages.CookieStatement.WhatScript')}</p>
          <br />
          <p>{t('pages.CookieStatement.script')}</p>
          <br />
          <p className={styles.italic}>{t('pages.CookieStatement.WhatTracker')}</p>
          <br />
          <p>{t('pages.CookieStatement.tracker')}</p>
          <br />
          <p className={styles.italic}>{t('pages.CookieStatement.WhatCookie')}</p>
          <br />
          <p>{t('pages.CookieStatement.cookie')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.CookieStatement.WhyTech')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.CookieStatement.purposeTech')}</p>
          <br />
          <p className={styles.italic}>{t('pages.CookieStatement.Func')}</p>
          <br />
          <p>{t('pages.CookieStatement.functional1')}</p>
          <p>{t('pages.CookieStatement.functional2')}</p>
          <br />
          <p className={styles.italic}>{t('pages.CookieStatement.Analytical')}</p>
          <br />
          <p>{t('pages.CookieStatement.analytical')}</p>
          <br />
          <p className={styles.italic}>{t('pages.CookieStatement.Marketing')}</p>
          <br />
          <p>{t('pages.CookieStatement.marketing')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.CookieStatement.Security')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p className={styles.italic}>{t('pages.CookieStatement.security')}</p>
          <br />
          <p>{t('pages.CookieStatement.securityTxt')}</p>
          <br />
          <p className={styles.italic}>{t('pages.CookieStatement.ThirdParty')}</p>
          <br />
          <p>{t('pages.CookieStatement.securityThirdParty')}</p>
        </div>
        <h2 className={styles.title}>{t('pages.CookieStatement.WhatRights')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p className={styles.italic}>{t('pages.CookieStatement.EnableCookie')}</p>
          <br />
          <p>{t('pages.CookieStatement.enableDisable1')}</p>
          <p>{t('pages.CookieStatement.enableDisable2')}</p>
          <p>{t('pages.CookieStatement.enableDisable3')}</p>
          <ul className={styles.indentedList}>
            <li><a href='https://support.google.com/chrome/answer/95647?hl=en'>Chrome</a></li>
            <li><a href='https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox'>Firefox</a></li>
            <li><a href='https://support.microsoft.com/en-us/topic/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d'>Internet Explorer</a></li>
            <li><a href='https://support.microsoft.com/en-us/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7943-a9e1-975a-a33d-ac10ce454ca4'>Edge</a></li>
            <li><a href='https://support.apple.com/en-en/HT201265'>Safari</a></li>
          </ul>
          <br />
          <p className={styles.italic}>{t('pages.CookieStatement.RightInspect')}</p>
          <br />
          <p>{t('pages.CookieStatement.inspect')}<a href='/privacystatement'>{t('pages.CookieStatement.privacy')}</a>{t('pages.CookieStatement.inspect2')}</p>
          <br />
          <p className={styles.italic}>{t('pages.CookieStatement.TipQuestion')}</p>
          <br />
          <p>{t('pages.CookieStatement.tips')}<a href='/privacystatement'>{t('pages.CookieStatement.privacy')}</a>{t('pages.CookieStatement.tips2')}</p>
          </div>
        <h2 className={styles.title}>{t('pages.CookieStatement.Conclusion')}</h2>
        <hr className={styles.line} />
        <div className={styles.text}>
          <p>{t('pages.CookieStatement.conclusion1')}</p>
          <br />
          <p>{t('pages.CookieStatement.conclusion2')}</p>
          <br />
          <p>{t('pages.CookieStatement.conclusion3')}</p>
          <br />
          <p>{t('pages.CookieStatement.conclusion4')}</p>
          <br />
          <p>{t('pages.CookieStatement.conclusion5')}</p>
          <br />
        </div>
      </div>
    </div>
  );
};

export default CookieStatementPage;
