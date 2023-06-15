import React from "react";
import {useNavigate} from "react-router-dom";

import Button from '@mui/material/Button';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import LanguageIcon from '@mui/icons-material/Language';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import PlaceIcon from '@mui/icons-material/Place';
import Typography from '@mui/material/Typography';

import {IOpeningHours, IRestaurantFrontEnd} from '../../../../shared/models/restaurantInterfaces';
import {NavigateTo} from "@src/utils/NavigateTo";
import Rating from "@src/components/RestoCard/Rating/Rating";
import ScrollOverlay from '../ScrollOverlay/ScrollOverlay';
import styles from "./RestoDetailOverlay.module.scss";

const PageBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Montserrat",
        textTransform: "none",
        fontSize: "1.13rem",
        fontWeight: "500",
        padding: "0"
      },
    },
    palette: {
      primary: {
        main: "#6d071a",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#094067",
        contrastText: "#ffffff",
      },
    },
    shape: {
      borderRadius: 5,
    },
  });
};

interface IRestaurantDetailProps {
  restaurant: IRestaurantFrontEnd;
  onClose: () => void;
}

const RestoDetailOverlay = (props: IRestaurantDetailProps) => {
  const navigate = useNavigate();
  const {
    pictures,
    name,
    rating,
    ratingCount,
    location,
    description,
    categories,
    openingHours,
    phoneNumber,
    website
  } = props.restaurant;
  const {streetName, streetNumber, postalCode, city, country} = location;
  const address = `${streetName} ${streetNumber}, ${postalCode} ${city}, ${country}`;

  if (!props.restaurant) {
    return null;
  }

  return (
    <ScrollOverlay isOpen={true} onClose={props.onClose}>
      <Grid container>
        {/* left column with image and opening hours */}
        <Grid item xs={3} className={styles.GridItemImage}>
          <div>
            {pictures.length > 0 && (
              <img src={pictures[0]} alt={name} className={styles.ImageDimensions}/>
            )}
          </div>
          {openingHours.length > 0 && (<div>
            <table className={styles.OpeningHours}>
              <thead>
              <tr>
                <th className={styles.OpeningHoursColumn}>Day</th>
                <th className={styles.OpeningHoursColumn}>Opening</th>
                <th className={styles.OpeningHoursColumn}>Closing</th>
              </tr>
              </thead>
              <tbody>
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                getDayOpeningHours(day, openingHours)
              ))}
              </tbody>
            </table>
          </div>)}
        </Grid>
        {/* right column with name, rating, address, phone, website, description and menu button */}
        <Grid item xs={9} className={styles.GridItem}>
          <div className={styles.FlexParent}>
            <Typography variant="h4" component="h2" className={styles.DishTitle}>
              {name}
            </Typography>
            <Rating restoRating={rating} restoRatingsCount={ratingCount}/>
          </div>
          <div className={styles.FlexParent}>
            <PlaceIcon/>
            <span className={styles.AddressText}>
                {location.streetNumber} {location.streetName}, {location.city}, {location.postalCode}, {location.country}
              </span>
          </div>
          {phoneNumber && (
            <div className={styles.FlexParent}>
              <LocalPhoneIcon/>
              <span className={styles.AddressText}>
                {phoneNumber}
              </span>
            </div>
          )}
          {website && (<div className={styles.FlexParent}>
            <LanguageIcon/>
            <span className={styles.AddressText}>
                {website}
              </span>
          </div>)}
          <p className={styles.JustificationPrintExtended}>
            {description}
          </p>
          <div className={styles.BtnPage}>
            <ThemeProvider theme={PageBtn()}>
              <Button
                className={styles.RestoBtn}
                variant="contained"
                onClick={() => NavigateTo("/menu", navigate, {
                  menu: categories,
                  restoName: name,
                  address: address,
                })}
              >
                Menu
              </Button>
            </ThemeProvider>
          </div>
        </Grid>
      </Grid>
    </ScrollOverlay>
  );
}

const getDayOpeningHours = (requestedDay: number, openingHours: IOpeningHours[]) => {
  const matchingDay = openingHours.find((item) => item.day === requestedDay);
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const readableDay = daysOfWeek[requestedDay];

  if (matchingDay) {
    return (<tr>
      <td className={styles.OpeningHoursColumn}>{readableDay}</td>
      <td className={styles.OpeningHoursColumn}>{matchingDay.open || '-'}</td>
      <td className={styles.OpeningHoursColumn}>{matchingDay.close || '-'}</td>
    </tr>);
  }

  return (<tr>
    <td className={styles.OpeningHoursColumn}>{readableDay}</td>
    <td className={styles.OpeningHoursColumn}>-</td>
    <td className={styles.OpeningHoursColumn}>-</td>
  </tr>);
};

export default RestoDetailOverlay;
