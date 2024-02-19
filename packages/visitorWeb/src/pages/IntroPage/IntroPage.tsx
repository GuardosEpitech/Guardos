import React, { useState, useRef } from 'react';
import { Card, CardContent, Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { NavigateTo } from "@src/utils/NavigateTo";
import IconSlider from '../../components/Slider/Slider';
import backgroundImage1 from '../../assets/user.jpg';
import backgroundImage2 from '../../assets/restaurant.jpg';
import styles from "./IntroPage.module.scss";

const IntroPage = () => {
  const [opacity1, setOpacity1] = useState(1);
  const [opacity2, setOpacity2] = useState(1);
  const targetSectionRef = useRef(null);
  const navigate = useNavigate();
  const baseUrlRestaurant = `${process.env.RESTAURANT_URL}`;

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
        <div className={styles.containerHeadline}>
          <h1>
            What do we provide?
          </h1>
        </div>
        <div>
          <IconSlider/>
        </div>
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
