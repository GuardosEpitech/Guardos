import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Container, Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { NavigateTo } from "@src/utils/NavigateTo";
import TeamSlider from '@src/components/Slider/TeamSlider';
import IconSlider from '../../components/Slider/Slider';
import backgroundImage1 from '../../assets/user.jpg';
import backgroundImage2 from '../../assets/restaurant.jpg';
import styles from "./IntroPage.module.scss";
import 'react-vertical-timeline-component/style.min.css';
import './timeline.min.css';
import { enable, disable, setFetchMethod} from "darkreader";
import {useTranslation} from "react-i18next";
import {checkDarkMode} from "../../utils/DarkMode";

const IntroPage = () => {
  const [opacity1, setOpacity1] = useState(1);
  const [opacity2, setOpacity2] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const targetSectionRef = useRef(null);
  const navigate = useNavigate();
  const baseUrlRestaurant = `${process.env.RESTAURANT_URL}`;
  const {t} = useTranslation();

  useEffect(() => {
    checkDarkMode();
  }, []);

  const menuItems = [
    { title: 'Guardos', text: t('pages.IntroPage.guardos-intro')},
    { title: 'Guardos - ' + t('pages.IntroPage.resto'), text:
        t('pages.IntroPage.resto-intro') },
    { title: 'Guardos - ' + t('pages.IntroPage.visitor'), text:
        t('pages.IntroPage.visitor-intro') },
  ];

  const handleItemClick = (index:any) => {
    setSelectedItem(index);
  };

  const handleMouseEnter = (index:number) => {
    if (index === 1) {
      setOpacity1(1);
      setOpacity2(0.7);
    } else {
      setOpacity1(0.7);
      setOpacity2(1);
    }
  };

  const handleMouseLeave = () => {
    console.log(baseUrlRestaurant);
    setOpacity1(1);
    setOpacity2(1);
  };

  const handleGetStartedClick = () => {
    // Scroll to the target section
    targetSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Box className={styles.root}>
        <Container component="main" maxWidth="xs" className={styles.overlay}>
          <Typography variant="h4" component="h1" className={styles.introText}>
            {t('pages.IntroPage.welcome')}
          </Typography>
          <Typography variant="body1" className={styles.introText}>
            {t('pages.IntroPage.let-us-introduce')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={styles.getStartedButton}
            onClick={handleGetStartedClick}
          >
            {t('pages.IntroPage.choose-site')}
          </Button>
        </Container>
      </Box>
      <div className={styles.sliderContainer}>
        <div className={styles.whatIsGuardosContainer}>
          <div className={styles.containerHeadline}>
            <h1>
              {t('pages.IntroPage.what-is-guardos')}
            </h1>
          </div>
          <div>
            <Box display="flex" className={styles.whatIsGuardos}>
              <List>
                {menuItems.map((item, index) => (
                  <ListItem
                    button
                    key={index}
                    selected={selectedItem === index}
                    onClick={() => handleItemClick(index)}
                  >
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))}
              </List>

              <Box ml={2} className={styles.textBox}>
                {selectedItem !== null && (
                  <Typography variant="body1">{menuItems[selectedItem].text}</Typography>
                )}
              </Box>
            </Box>
          </div>
        </div>
        <div className={styles.containerHeadline}>
          <h1>
            {t('pages.IntroPage.what-we-provide')}
          </h1>
        </div>
        <div>
          <IconSlider/>
        </div>
        <div className={styles.containerHeadline}>
          <h1>
            {t('pages.IntroPage.the-team')}
          </h1>
        </div>
        <div>
          <TeamSlider/>
        </div>
      </div>

      <div className={`${styles.fullHeight} ${styles.timelineOfProject}`}>
        <div className={styles.containerHeadline}>
          <h1>
            {t('pages.IntroPage.progress')}
          </h1>
        </div>
        <VerticalTimeline>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: '#4caf50', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  #4caf50' }}
            date="Week 1-4"
            iconStyle={{ background: "#4caf50", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">{t('pages.IntroPage.test-learn')}</h3>
            <p>{t('pages.IntroPage.test-learn-text')}</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: '#4caf50', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  #4caf50' }}
            date="Week 5-8"
            iconStyle={{ background: "#4caf50", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">{t('pages.IntroPage.mgnt-process')}</h3>
            <p>{t('pages.IntroPage.mgnt-process-text')}</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: '#4caf50', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  #4caf50' }}
            date="Week 9-12"
            iconStyle={{ background: "#4caf50", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">{t('pages.IntroPage.fast-forward')}</h3>
            <p>{t('pages.IntroPage.fast-forward-text')}</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date="Week 13-17"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">{t('pages.IntroPage.beta-growth')}</h3>
            <p>{t('pages.IntroPage.beta-growth-text')}</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(233, 30, 99)' }}
            date="Week 18-22"
            iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">{t('pages.IntroPage.consolidation')}</h3>
            <p>{t('pages.IntroPage.consolidation-text')}</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(233, 30, 99)' }}
            date="Week 22-26"
            iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">{t('pages.IntroPage.launch-metrics')}</h3>
            <p>{t('pages.IntroPage.launch-metrics-text')}</p>
          </VerticalTimelineElement>
          {/* Add similar VerticalTimelineElement components for each phase */}
          
        </VerticalTimeline>
      </div>

      <div className={styles.fullHeight} ref={targetSectionRef}>
        <div className={styles.containerHeadlineSecond}>
          <h1>
            {t('pages.IntroPage.choose-service')}
          </h1>
        </div>

        <div className={styles.container}>
          <Card
            className={styles.card}
            style={{ opacity: opacity1 }}
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
            onClick={() => NavigateTo('/', navigate, {})}
          >
            <div className={styles.circleContainer}>
              <img
                src={backgroundImage1}
                alt={t('pages.IntroPage.user-site')}
                className={styles.circleImage}
              />
            </div>
            <CardContent className={styles.cardContent}> 
              {/* Content for section 1 */}
              <Typography variant="h5" className={styles.h5}>{t('pages.IntroPage.user-site')}</Typography>
              <Typography variant="body1" className={styles.body1}>
                {t('pages.IntroPage.user-site-text-1')}<br></br>
                {t('pages.IntroPage.user-site-text-2')}<br></br>
                {t('pages.IntroPage.user-site-text-3')}
              </Typography>
            </CardContent>
          </Card>

          <Card
            className={styles.card}
            style={{ opacity: opacity2 }}
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave}
            onClick={() => 
              window.location.href = baseUrlRestaurant
            }
          >
            <div className={styles.circleContainer}>
              <img
                src={backgroundImage2}
                alt={t('pages.IntroPage.resto-site')}
                className={styles.circleImage}
              />
            </div>
            <CardContent className={styles.cardContent}>
              {/* Content for section 2 */}
              <Typography variant="h5" className={styles.h5}>{t('pages.IntroPage.resto-site')}</Typography>
              <Typography variant="body1" className={styles.body1}>
                {t('pages.IntroPage.resto-site-text-1')}<br></br>
                {t('pages.IntroPage.resto-site-text-2')}<br></br>
                {t('pages.IntroPage.resto-site-text-3')}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
