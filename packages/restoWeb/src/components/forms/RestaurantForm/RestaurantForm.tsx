import {useNavigate} from "react-router-dom";
import {defaultRestoImage} from 'shared/assets/placeholderImageBase64';
import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { addNewResto, editResto } from "@src/services/restoCalls";
import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "./RestaurantForm.module.scss";
import { IAddRestoRequest, IAddResto }
  from "shared/models/restaurantInterfaces";
import { IimageInterface } from "shared/models/imageInterface";
import {convertImageToBase64, displayImageFromBase64}
  from "shared/utils/imageConverter";
import {addImageResto, deleteImageRestaurant, getImages}
  from "@src/services/callImages";

const PageBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Montserrat",
        textTransform: "none",
        fontSize: "1.13rem",
        fontWeight: "500",
      },
    },
    palette: {
      primary: {
        main: "#AC2A37",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#094067",
        contrastText: "#ffffff",
      },
    },
    shape: {
      borderRadius: 5
    }
  });
};

interface IOpeningHours {
  open?: string;
  close?: string;
  day?: number;
}

interface IRestaurantFormProps {
  restaurantName?: string;
  street?: string;
  streetNumber?: number;
  postalCode?: string;
  city?: string;
  country?: string;
  description?: string;
  imageSrc?: string;
  phone?: string;
  add?: boolean;
  openingHours?: IOpeningHours[];
  website?: string;
  picturesId?: number[];
}

interface IDay {
  id?: number;
  name?: string;
}

const days: IDay[] = [
  { id: 0, name: "Monday" },
  { id: 1, name: "Tuesday" },
  { id: 2, name: "Wednesday" },
  { id: 3, name: "Thursday" },
  { id: 4, name: "Friday" },
  { id: 5, name: "Saturday" },
  { id: 6, name: "Sunday" },
];

const RestaurantForm = (props: IRestaurantFormProps) => {
  const navigate = useNavigate();
  let {
    restaurantName,
    street,
    streetNumber,
    postalCode,
    city,
    country,
    description,
    phone,
    website,
    // eslint-disable-next-line prefer-const
    picturesId
  } = props;
  let openingHours = props.openingHours ? props.openingHours : [];
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const origRestoName = restaurantName;

  useEffect(() => {
    const fetchImages = async () => {
      if (props.picturesId && props.picturesId.length > 0) {
        try {
          const answer = await getImages(props.picturesId);
          const fetchedPictures = answer.map((image: any) => ({
            base64: image.base64,
            contentType: image.contentType,
            filename: image.filename,
            size: image.size,
            uploadDate: image.uploadDate,
            id: image.id,
          }));
          setPictures(fetchedPictures);
        } catch (error) {
          setPictures([{
            base64: defaultRestoImage,
            contentType: "png",
            filename: "placeholderResto.png",
            size: 0,
            uploadDate: "0",
            id: 0,
          }]);
        }
      } else {
        setPictures([{
          base64: defaultRestoImage,
          contentType: "png",
          filename: "placeholderResto.png",
          size: 0,
          uploadDate: "0",
          id: 0,
        }]);
      }
    };

    fetchImages();
  }, [props.picturesId]);

  function addTimeOpen(data: IOpeningHours) {
    if (Array.isArray(openingHours)) {
      const existingObjectIndex: number = openingHours.findIndex(
        (item) => item.day === data.day
      );
      if (existingObjectIndex >= 0) {
        const updatedOpeningHours = openingHours.map((item, index) => {
          if (index === existingObjectIndex) {
            return { ...item, open: data.open };
          }
          return item;
        });
        openingHours = updatedOpeningHours;
      } else {
        openingHours = [...openingHours, data];
      }
    }
  }

  function addTimeClose(data: IOpeningHours) {
    if (Array.isArray(openingHours)) {
      const existingObjectIndex: number = openingHours.findIndex(
        (item) => item.day === data.day
      );
      if (existingObjectIndex >= 0) {
        const updatedOpeningHours = openingHours.map((item, index) => {
          if (index === existingObjectIndex) {
            return { ...item, close: data.close };
          }
          return item;
        });
        openingHours = updatedOpeningHours;
      } else {
        openingHours = [...openingHours, data];
      }
    }
  }

  async function sendRequestAndGoBack() {
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      console.log("Error getting user ID");
      return;
    }
    const resto: IAddResto = {
      name: restaurantName,
      phoneNumber: phone,
      description: description,
      website: website,
      openingHours: openingHours,
      location: {
        streetName: street,
        streetNumber: streetNumber.toString(),
        postalCode: postalCode,
        city: city,
        country: country,
        latitude: "0",
        longitude: "0",
      }
    };
    const data: IAddRestoRequest  = {
      userToken: userToken,
      resto: resto,
    };
    if (props.add) {
      await addNewResto(data);
    } else {
      await editResto(origRestoName, resto);
    }
    return NavigateTo("/", navigate, { successfulForm: true });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const base64 = convertImageToBase64(file);
      base64.then((result) => {
        addImageResto(restaurantName, file.name, file.type, file.size, result)
          .then(r => {
            setPictures([{ base64: result, contentType: file.type,
              filename: file.name, size: file.size, uploadDate: "0", id: r }]);
            if (picturesId.length > 0) {
              deleteImageRestaurant(picturesId[0], restaurantName);
              picturesId.shift();
            }
            picturesId.push(r);
          });
      });
    }
  };

  function handeFileDelete() {
    if (picturesId.length > 0) {
      deleteImageRestaurant(picturesId[0], restaurantName);
      displayImageFromBase64(defaultRestoImage, "restoImg");
      setPictures([{
        base64: defaultRestoImage,
        contentType: "png",
        filename: "placeholderResto.png",
        size: 0,
        uploadDate: "0",
        id: 0,
      }]);
    }
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
      <Grid
        className={styles.GridSpaceTop}
        container
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={4} sm={2} md={3}>
          {pictures.length > 0 &&
          <img
            src={pictures[0].base64}
            alt="Restaurant Image"
            className={styles.ImageDimensions}
          />
          }
          <div className={styles.FormControlMargin}>
            <FormControl className={styles.ImageFlex}>
              <ThemeProvider theme={PageBtn()}>
                <Button
                  className={styles.FormControlMargin}
                  variant="outlined"
                  component="label"
                >
                  Change Image
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleFileChange}/>
                </Button>
                <Button
                  className={styles.FormControlMargin}
                  variant="text"
                  component="label"
                  onClick={handeFileDelete}
                >
                  Delete Image
                </Button>
              </ThemeProvider>
            </FormControl>
          </div>
        </Grid>

        <Grid className={styles.TextNextToImageField} item xs={4} sm={6} md={9}>
          <Grid
            container
            spacing={{xs: 2, md: 3}}
            columns={{xs: 4, sm: 8, md: 12}}
          >
            <Grid item xs={4} sm={5} md={8} className={styles.FieldMarginRight}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">Name</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={restaurantName}
                  label="Name"
                  onChange={(e) => (restaurantName = e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={3} md={4} className={styles.FieldMarginLeft}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">
                  Phone number
                </InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={phone}
                  label="Phone number"
                  onChange={(e) => (phone = e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={7} md={10}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">
                  Street name
                </InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={street}
                  label="Street name"
                  onChange={(e) => (street = e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1} sm={1} md={2}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">
                  Street number
                </InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={streetNumber}
                  label="Street number"
                  onChange={(e) => (streetNumber = parseInt(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">
                  Postal code
                </InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={postalCode}
                  label="Postal code"
                  onChange={(e) => (postalCode = e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">City</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={city}
                  label="City"
                  onChange={(e) => (city = e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">Country</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={country}
                  label="Country"
                  onChange={(e) => (country = e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  defaultValue={description}
                  label="Description"
                  multiline
                  onChange={(e) => (description = e.target.value)}
                />
              </FormControl>
            </Grid>
            {days.map((index, key) => (
              <LocalizationProvider dateAdapter={AdapterDayjs} key={key}>
                <Grid item xs={4} sm={8} md={1.71}>
                  <FormControl fullWidth>
                    <span className={styles.DayDisplay}>{index.name}</span>
                    <TimePicker
                      label="Opening"
                      ampm={false}
                      defaultValue={openingHours[key]?.open || null}
                      onChange={(value: any) =>
                        addTimeOpen({
                          open:
                            new Date(value.$d)
                              .getHours() +
                            ":" +
                            new Date(value.$d)
                              .getMinutes(),
                          day: index.id,
                        })
                      }
                    />
                    <br />
                    <TimePicker
                      label="Closing"
                      ampm={false}
                      defaultValue={openingHours[key]?.close || null}
                      onChange={(value: any) =>
                        addTimeClose({
                          close:
                            new Date(value.$d)
                              .getHours() +
                            ":" +
                            new Date(value.$d)
                              .getMinutes(),
                          day: index.id,
                        })
                      }
                    />
                  </FormControl>
                </Grid>
              </LocalizationProvider>
            ))}
            <Grid item xs={4} sm={8} md={5.15}>
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  defaultValue={website}
                  label="Web Site"
                  multiline
                  onChange={(e) => (website = e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ThemeProvider theme={PageBtn()}>
        <Button
          className={styles.SaveBtn}
          variant="contained"
          sx={{ width: "12.13rem" }}
          onClick={sendRequestAndGoBack}
        >
          Save
        </Button>
      </ThemeProvider>
    </Box>
  );
};

export default RestaurantForm;
