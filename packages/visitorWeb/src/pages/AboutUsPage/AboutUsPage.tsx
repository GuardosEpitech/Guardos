import React, { useState } from "react";
import styles from "./AboutUsPage.module.scss";
import Header from "@src/components/Header/Header";
import josi from "@src/assets/profile/josi.png";
import gylian from "@src/assets/profile/gylian.png";
import mark from "@src/assets/profile/mark.png";
import ramon from "@src/assets/profile/ramon.png";
import renan from "@src/assets/profile/renan.png";
import alban from "@src/assets/profile/alban.png";

const teamMembers = [
    {
      id: 1,
      photo: josi,
      description: '4th year Epitech student from Germany',
    },
    {
      id: 2,
      photo: gylian,
      description: '4th year Epitech student from Germany',
    },
    {
        id: 3,
        photo: mark,
        description: '4th year Epitech student from Germany',
      },
      {
        id: 4,
        photo: ramon,
        description: '4th year Epitech student from Germany',
      },
      {
        id: 5,
        photo: alban,
        description: '4th year Epitech student from France',
      },
      {
        id: 6,
        photo: renan,
        description: '4th year Epitech student from France',
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

const AboutUsPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');
    return (
        <div>
            <Header />
            <div className={styles.aboutuscontainer}>
              <div className={styles.navigation}>
                <button onClick={() => setActiveSection('introduction')}>Introduction</button>
                <button onClick={() => setActiveSection('founding-story')}>Founding Story</button>
                <button onClick={() => setActiveSection('mission-and-values')}>Mission and Values</button>
                <button onClick={() => setActiveSection('team-members')}>Team Members</button>
              </div>

              {
                activeSection === 'introduction' && (
                  <div className={styles.aboutussection}>
                    <h2>About Us</h2>
                    <div className={styles.logocontainer}>
                      <div className={styles.logo}></div>
                      <p>
                        {description}
                        <br />
                        <span>
                          <a href="/register" className={styles.signupLink}>
                            Sign up 
                          </a>
                          {' '}for free and explore a world of personalized dining!
                        </span>
                      </p>
                    </div>
                  </div>
                )
              }
              {
                activeSection === 'founding-story' && (
                  <div className={styles.foundingstorysection}>
                    <h2>Founding Story</h2>
                    <p>{foundingstory}</p>
                  </div>
                )
              }

              {
                activeSection === 'mission-and-values' && (
                  <div className={styles.missionvaluessection}>
                    <h2>Mission and Values</h2>
                    <section className={styles.missionValuesSection}>
                        <div className={styles.value}>
                          <h3>Empowerment and Inclusivity</h3>
                          <p>
                            Empower individuals to make informed and inclusive dining choices that cater to their unique dietary preferences and restrictions.
                          </p>
                        </div>

                        <div className={styles.value}>
                          <h3>Transparency and Trust</h3>
                          <p>
                            Provide transparent and trustworthy information about restaurant menus, ingredients, and preparation methods to ensure users can make confident dining decisions.
                          </p>
                        </div>

                        <div className={styles.value}>
                          <h3>Continuous Improvement and Innovation</h3>
                          <p>
                            Commit to ongoing improvement, incorporating user feedback, technological advancements, and industry best practices to deliver a continually valuable service.
                          </p>
                        </div>
                      </section>
                  </div>
                )
              }
                
              {
                activeSection === 'team-members' && (
                  <div className={styles.teamsection}>
                      <h2>The Team</h2>
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
                        <p>{teamdescription}</p>
                      </div> */}
                  </div>
                )
              }
            </div>
        </div>
    );
};

export default AboutUsPage;