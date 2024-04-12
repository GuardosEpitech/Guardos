import React, { useState , useEffect} from "react";
import styles from "./AboutUsPage.module.scss";
import josi from "@src/assets/profile/josi.png";
import gylian from "@src/assets/profile/gylian.png";
import mark from "@src/assets/profile/mark.png";
import ramon from "@src/assets/profile/ramon.png";
import renan from "@src/assets/profile/renan.png";
import alban from "@src/assets/profile/alban.png";
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";

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

  const description = `Guardos is your trusted companion in the world of dining, 
  specially crafted for individuals with food intolerances and specific culinary preferences. 
  Our innovative platform empowers you to effortlessly discover restaurants in your vicinity 
  that cater to your unique dietary needs. 
  Whether you're gluten-free, vegan, or have other dietary restrictions, 
  Guardos ensures that your dining experience is tailored to your tastes. 
  Say goodbye to the hassle of searching for suitable options – with Guardos, 
  finding the perfect restaurant that aligns with your preferences is just a click away. 
  Enjoy a seamless and delightful dining experience with Guardos, 
  where your food choices are always respected and celebrated.`;

  const foundingstory = `Our journey at Guardos commenced during our college days, 
  where a diverse group of individuals, each navigating the challenges of food intolerances, found common ground. 
  Whether grappling with our own dietary restrictions or witnessing the struggles of friends and family, 
  we recognized the pervasive inconvenience of deciphering suitable meals. 
  Fueled by the collective desire to simplify the process of finding delicious and tailored dining options, 
  we came together with a shared mission: to solve the intricate puzzle of eating well, no matter the dietary constraints. 
  Thus, Guardos was born, a dedicated effort to empower individuals in their quest for enjoyable and hassle-free dining experiences`;

  const teamdescription = `Our journey began during our time as students, 
  brought together by a shared passion for making a positive impact. 
  What unites us is not only our academic pursuits but a common understanding 
  of the challenges posed by food intolerances. 
  Whether personally affected or witnessing the struggles of friends and family, we recognized the need for change.
  Driven by empathy and a desire to contribute, we formed a team committed to making a difference in the lives of 
  those dealing with food intolerances. 
  Our diverse backgrounds and skills converge with a singular purpose — to create solutions that enhance the quality of life 
  for individuals affected by dietary restrictions. 
  Together, we embark on a journey to empower and support our community, one innovative idea at a time.`;


  useEffect(() => {
    checkDarkMode();
  }, []);

  const checkDarkMode = () => {
    if ((localStorage.getItem('darkMode')) == 'true'){
    setFetchMethod((url) => {
      return fetch(url, {
        mode: 'no-cors',
      });
    });
    enable({
      brightness: 100,
      contrast: 100,
      darkSchemeBackgroundColor: '#181a1b',
      darkSchemeTextColor: '#e8e6e3'
    },);
    } else {
      disable();
    }
  }

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
