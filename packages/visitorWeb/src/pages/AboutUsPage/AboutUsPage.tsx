import React, { useState , useEffect} from "react";
import styles from "./AboutUsPage.module.scss";
import josi from "@src/assets/profile/josi.png";
import gylian from "@src/assets/profile/gylian.png";
import mark from "@src/assets/profile/mark.png";
import ramon from "@src/assets/profile/ramon.png";
import renan from "@src/assets/profile/renan.png";
import alban from "@src/assets/profile/alban.png";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

const AboutUsPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const {t} = useTranslation();
  const teamMembers = [
    {
      id: 1,
      photo: josi,
      description: t('pages.AboutUs.german-team-member'),
    },
    {
      id: 2,
      photo: gylian,
      description: t('pages.AboutUs.german-team-member'),
    },
    {
      id: 3,
      photo: mark,
      description: t('pages.AboutUs.german-team-member'),
    },
    {
      id: 4,
      photo: ramon,
      description: t('pages.AboutUs.german-team-member'),
    },
    {
      id: 5,
      photo: alban,
      description: t('pages.AboutUs.french-team-member'),
    },
    {
      id: 6,
      photo: renan,
      description: t('pages.AboutUs.french-team-member'),
    },
  ];

  useEffect(() => {
    checkDarkMode();
  }, []);

    return (
        <div>
            <div className={styles.aboutuscontainer}>
              <div className={styles.navigation}>
                <button onClick={() => setActiveSection('introduction')}>
                  {t('pages.AboutUs.introduction')}
                </button>
                <button onClick={() => setActiveSection('founding-story')}>
                  {t('pages.AboutUs.founding-story')}
                </button>
                <button onClick={() => setActiveSection('mission-and-values')}>
                  {t('pages.AboutUs.mission-and-values')}
                </button>
                <button onClick={() => setActiveSection('team-members')}>
                  {t('pages.AboutUs.team-members')}
                </button>
              </div>

              {
                activeSection === 'introduction' && (
                  <div className={styles.aboutussection}>
                    <h2>{t('pages.AboutUs.about-us')}</h2>
                    <div className={styles.descriptionContainer}>
                      <div className={styles.logoContainer}>
                        <div className={styles.logo}></div>
                      </div>
                      <p>
                        {t('pages.AboutUs.introduction-text')}
                        <br />
                        <span>
                          <a href="/register" className={styles.signupLink}>
                            {t('pages.AboutUs.sign-up')}
                          </a>
                          {t('pages.AboutUs.for-free')}
                        </span>
                      </p>
                    </div>
                  </div>
                )
              }
              {
                activeSection === 'founding-story' && (
                  <div className={styles.foundingstorysection}>
                    <h2>{t('pages.AboutUs.founding-story')}</h2>
                    <p>{t('pages.AboutUs.founding-story-text')}</p>
                  </div>
                )
              }

              {
                activeSection === 'mission-and-values' && (
                  <div className={styles.missionvaluessection}>
                    <h2>{t('pages.AboutUs.mission-and-values')}</h2>
                    <section className={styles.missionValuesSection}>
                        <div className={styles.value}>
                          <h3>{t('pages.AboutUs.empowerment')}</h3>
                          <p>
                            {t('pages.AboutUs.empowerment-text')}
                          </p>
                        </div>

                        <div className={styles.value}>
                          <h3>{t('pages.AboutUs.transparency')}</h3>
                          <p>
                            {t('pages.AboutUs.transparency-text')}
                          </p>
                        </div>

                        <div className={styles.value}>
                          <h3>{t('pages.AboutUs.continuous-improvement')}</h3>
                          <p>
                            {t('pages.AboutUs.improvement-text')}
                          </p>
                        </div>
                      </section>
                  </div>
                )
              }
                
              {
                activeSection === 'team-members' && (
                  <div className={styles.teamsection}>
                      <h2>{t('pages.AboutUs.team-members')}</h2>
                      <div className={styles.teammembers}>
                          {teamMembers.map((member) => (
                              <div key={member.id} className={styles.teammember}>
                              <div
                                  className={styles.memberphoto}
                                  style={{ backgroundImage: `url(${member.photo})` }}
                              > 
                                  <p className={styles.memberdescription}>{member.description}</p>
                              </div>
                              </div>
                          ))}
                      </div>
                      {/* <div className={styles.teamdescription}>
                        <p>{t('pages.AboutUs.team-description')}</p>
                      </div> */}
                  </div>
                )
              }
            </div>
        </div>
    );
};

export default AboutUsPage;
