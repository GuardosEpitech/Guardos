import React, { useState, useRef } from 'react';
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

const IntroPage = () => {
  const [opacity1, setOpacity1] = useState(1);
  const [opacity2, setOpacity2] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const targetSectionRef = useRef(null);
  const navigate = useNavigate();
  const baseUrlRestaurant = `${process.env.RESTAURANT_URL}`;

  const menuItems = [
    { title: 'Guardos', text: 
      'At Guardos, our mission is to empower individuals to lead fulfilling lives by providing them with the knowledge, tools, and support needed to navigate the complexities of food intolerances. We believe that everyone deserves to enjoy a vibrant and healthy life, and that starts with understanding and managing ones relationship with food.' },
    { title: 'Guardos - Restaurant', text: 
      'On the Guardos - Restaurant page we will open the possibility to register restaurants. (This registration must be done by the owner) We will then offer you with Guardos a platform to market your business. Features on this page are: Various menus for self-selection and the corresponding self-design of the structure, a QR scanner function with which products and their associated allergens are automatically registered.' },
    { title: 'Guardos - Visitor', text: 
      'On the Guardos - Visitor page we offer customers who are looking for a restaurant a filter mask with the corresponding allergens. An exact list of restaurants and a self-designed profile with various customizable settings for reuse. Features here are: Remembering allergens in the profile, favorite restaurants and a transparent view of all dishes.' },
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
            Welcome to Guardos!
          </Typography>
          <Typography variant="body1" className={styles.introText}>
            We are delighted to have you here. Help us in our mission to make food easily accessible to everyone.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={styles.getStartedButton}
            onClick={handleGetStartedClick}
          >
            Choose your Site
          </Button>
        </Container>
      </Box>
      <div className={styles.sliderContainer}>
        <div className={styles.whatIsGuardosContainer}>
          <div className={styles.containerHeadline}>
            <h1>
              What is Guardos?
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
            What do we provide?
          </h1>
        </div>
        <div>
          <IconSlider/>
        </div>
        <div className={styles.containerHeadline}>
          <h1>
            The Team behind Guardos
          </h1>
        </div>
        <div>
          <TeamSlider/>
        </div>
      </div>

      <div className={`${styles.fullHeight} ${styles.timelineOfProject}`}>
        <div className={styles.containerHeadline}>
          <h1>
            Progress of the project
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
            <h3 className="vertical-timeline-element-title">Test & Learn</h3>
            <p>Conceptualization and design of the apps for customers and restaurants
                First development phase of the website (Visitor)</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: '#4caf50', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  #4caf50' }}
            date="Week 5-8"
            iconStyle={{ background: "#4caf50", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">Management & Processes</h3>
            <p>First development phase of the website (Restaurant)</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: '#4caf50', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  #4caf50' }}
            date="Week 9-12"
            iconStyle={{ background: "#4caf50", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">Fast Forward</h3>
            <p>First development phase of the apps</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date="Week 13-17"
            iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">Beta & Growth Hacking</h3>
            <p>Fine-tuning and final testing of visitor web and restaurant web</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(233, 30, 99)' }}
            date="Week 18-22"
            iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">Consolidation</h3>
            <p>Fine-tuning and final testing of the apps</p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(233, 30, 99)' }}
            date="Week 22-26"
            iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
            icon={<i className="fas fa-tasks" />}
          >
            <h3 className="vertical-timeline-element-title">Launch & Metrics</h3>
            <p>Official launch</p>
          </VerticalTimelineElement>
          {/* Add similar VerticalTimelineElement components for each phase */}
          
        </VerticalTimeline>
      </div>

      <div className={styles.fullHeight} ref={targetSectionRef}>
        <div className={styles.containerHeadlineSecond}>
          <h1>
            Choose the service for your needs!
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
                alt="User Site"
                className={styles.circleImage}
              />
            </div>
            <CardContent className={styles.cardContent}> 
              {/* Content for section 1 */}
              <Typography variant="h5" className={styles.h5}>User Site</Typography>
              <Typography variant="body1" className={styles.body1}>
                Having trouble finding good restaurants that respect your food choices?<br></br>
                With our user page you will find all restaurants based on your food preferences.<br></br>
                Simply register to keep coming back to your favorite restaurants.
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
                alt="Restaurant Site"
                className={styles.circleImage}
              />
            </div>
            <CardContent className={styles.cardContent}>
              {/* Content for section 2 */}
              <Typography variant="h5" className={styles.h5}>Restaurant Site</Typography>
              <Typography variant="body1" className={styles.body1}>
                Do you own a restaurant and want to take it to the next medial level?<br></br>
                However, you have no experience of how to do this?<br></br>
                Then take a look at the offers on our entrepreneur page and get in tune with your business.
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
