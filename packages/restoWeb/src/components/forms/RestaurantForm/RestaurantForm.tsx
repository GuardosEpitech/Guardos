import {useNavigate} from "react-router-dom";
import {defaultRestoImage} from 'shared/assets/placeholderImageBase64';
import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
  Autocomplete
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { addNewResto, editResto, getAllMenuDesigns, getAllRestaurantChainsByUser } from "@src/services/restoCalls";
import { NavigateTo } from "@src/utils/NavigateTo";
import styles from "./RestaurantForm.module.scss";
import { IAddRestoRequest, IAddResto }
  from "shared/models/restaurantInterfaces";
import { IimageInterface } from "shared/models/imageInterface";
import { IMenuDesigns } from "shared/models/menuDesignsInterfaces";
import {convertImageToBase64, displayImageFromBase64}
  from "shared/utils/imageConverter";
import {addImageResto, deleteImageRestaurant, getImages}
  from "@src/services/callImages";
import {useTranslation} from "react-i18next";

const PageBtn = () => {
  return createTheme({
    typography: {
      button: {
        fontFamily: "Calibri",
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
  menuDesignID?: number;
  restoChainID?: number;
}

interface IDay {
  id?: number;
  name?: string;
}

// TODO: apply i18n
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
  const {
    restaurantName,
    street,
    streetNumber,
    postalCode,
    city,
    country,
    description,
    phone,
    website,
    picturesId,
    menuDesignID,
    openingHours,
    restoChainID
  } = props;
  const [pictures, setPictures] = useState<IimageInterface[]>([]);
  const [menuDesigns, setMenuDesigns] = useState<IMenuDesigns[]>([]);
  const [restoChains, setRestoChains] = useState<{uid: number, name: string}[]>([]);
  const [selectedMenuDesignId, setSelectedMenuDesignId] = useState(0);
  const [selectedRestoChainId, setSelectedRestoChainId] = useState(0);
  const [selectedRestaurantName, setSelectedRestaurantName] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [selectedStreetNumber, setSelectedStreetNumber] = useState(0);
  const [selectedPostalCode, setSelectedPostalCode] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedPhone, setSelectedPhone] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [selectedOpeningHours, setSelectedOpeningHours] = useState<IOpeningHours[]>([]);
  const [value, setValue] = useState(null);
  const [valueRestoChain, setValueRestoChain] = useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [inputValueRestoChain, setInputValueRestoChain] = React.useState("");
  const origRestoName = restaurantName;
  const {t} = useTranslation();

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

    setSelectedRestaurantName(restaurantName);
    setSelectedStreet(street);
    setSelectedStreetNumber(streetNumber);
    setSelectedPostalCode(postalCode);
    setSelectedCity(city);
    setSelectedCountry(country);
    setSelectedDescription(description);
    setSelectedPhone(phone);
    setSelectedWebsite(website);
    if (openingHours) {
      setSelectedOpeningHours(openingHours);
    }
    fetchImages();

    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      console.log("Error getting user ID");
      return;
    }
    getAllMenuDesigns(userToken)
      .then((res) => {
        setMenuDesigns(res);

        if (menuDesignID !== undefined) {
          setValue(res.find((menuDesign:IMenuDesigns) => menuDesign._id === menuDesignID));
        }
      });
    getAllRestaurantChainsByUser(userToken)
      .then((res) => {
        setRestoChains(res);

        if (restoChainID !== undefined) {
          setValueRestoChain(res.find((restoChain:{uid:number, name:string}) => restoChain.uid === restoChainID));
        }
      });
  }, [props.picturesId]);

  function addTimeOpen(data: IOpeningHours) {
    if (Array.isArray(selectedOpeningHours)) {
      const existingObjectIndex: number = selectedOpeningHours.findIndex(
        (item) => item.day === data.day
      );
      if (existingObjectIndex >= 0) {
        const updatedOpeningHours = selectedOpeningHours.map((item, index) => {
          if (index === existingObjectIndex) {
            return { ...item, open: data.open };
          }
          return item;
        });
        setSelectedOpeningHours(updatedOpeningHours);
      } else {
        setSelectedOpeningHours([...selectedOpeningHours, data]);
      }
    }
  }

  function addTimeClose(data: IOpeningHours) {
    if (Array.isArray(selectedOpeningHours)) {
      const existingObjectIndex: number = selectedOpeningHours.findIndex(
        (item) => item.day === data.day
      );
      if (existingObjectIndex >= 0) {
        const updatedOpeningHours = selectedOpeningHours.map((item, index) => {
          if (index === existingObjectIndex) {
            return { ...item, close: data.close };
          }
          return item;
        });
        setSelectedOpeningHours(updatedOpeningHours);
      } else {
        setSelectedOpeningHours([...selectedOpeningHours, data]);
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
      name: selectedRestaurantName,
      phoneNumber: selectedPhone,
      description: selectedDescription,
      website: selectedWebsite,
      openingHours: selectedOpeningHours,
      location: {
        streetName: selectedStreet,
        streetNumber: selectedStreetNumber.toString(),
        postalCode: selectedPostalCode,
        city: selectedCity,
        country: selectedCountry,
        latitude: "0",
        longitude: "0",
      },
      menuDesignID: selectedMenuDesignId,
      restoChainID: selectedRestoChainId
    };
    const data: IAddRestoRequest  = {
      userToken: userToken,
      resto: resto,
    };
    if (props.add) {
      await addNewResto(data);
    } else {
      await editResto(origRestoName, resto, userToken);
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
        {!props.add && (
          <Grid item xs={4} sm={2} md={3}>
            {pictures.length > 0 &&
          <img
            src={pictures[0].base64}
            alt={t('components.RestaurantForm.alt-img')}
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
                    {t('components.RestaurantForm.change-image')}
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
                    {t('components.RestaurantForm.delete-image')}
                  </Button>
                </ThemeProvider>
              </FormControl>
            </div>
          </Grid>
        )}

        <Grid className={styles.TextNextToImageField} item xs={4} sm={6} md={9}>
          <Grid
            container
            spacing={{xs: 2, md: 3}}
            columns={{xs: 4, sm: 8, md: 12}}
          >
            <Grid item xs={4} sm={5} md={8} className={styles.FieldMarginRight}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">{t('components.RestaurantForm.name')}</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={restaurantName}
                  label={t('components.RestaurantForm.name')}
                  onChange={(e) => (setSelectedRestaurantName(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={3} md={4} className={styles.FieldMarginLeft}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">
                  {t('components.RestaurantForm.phone-number')}
                </InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={phone}
                  label={t('components.RestaurantForm.phone-number')}
                  onChange={(e) => (setSelectedPhone(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} sm={7} md={10}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">
                  {t('components.RestaurantForm.street-name')}
                </InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={street}
                  label={t('components.RestaurantForm.street-name')}
                  onChange={(e) => (setSelectedStreet(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1} sm={1} md={2}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">
                  {t('components.RestaurantForm.street-number')}
                </InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={streetNumber}
                  label={t('components.RestaurantForm.street-number')}
                  onChange={(e) => (setSelectedStreetNumber(parseInt(e.target.value)))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">
                  {t('components.RestaurantForm.postal-code')}
                </InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={postalCode}
                  label={t('components.RestaurantForm.postal-code')}
                  onChange={(e) => (setSelectedPostalCode(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">{t('components.RestaurantForm.city')}</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={city}
                  label={t('components.RestaurantForm.city')}
                  onChange={(e) => (setSelectedCity(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor="component-outlined">{t('components.RestaurantForm.country')}</InputLabel>
                <OutlinedInput
                  id="component-outlined"
                  defaultValue={country}
                  label={t('components.RestaurantForm.country')}
                  onChange={(e) => (setSelectedCountry(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={8} md={12}>
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  defaultValue={description}
                  label={t('components.RestaurantForm.description')}
                  multiline
                  onChange={(e) => (setSelectedDescription(e.target.value))}
                />
              </FormControl>
            </Grid>
            {days.map((index, key) => {
              const dayOpeningHours = selectedOpeningHours.find(item => item.day === index.id) || {};
              return (
                <LocalizationProvider dateAdapter={AdapterDayjs} key={key}>
                  <Grid item xs={4} sm={8} md={1.71}>
                    <FormControl fullWidth>
                      <span className={styles.DayDisplay}>{index.name}</span>
                      <TimePicker
                        label={t('components.RestaurantForm.opening')}
                        ampm={false}
                        value={dayOpeningHours.open ? dayjs(dayOpeningHours.open, "HH:mm") : null}
                        onChange={(value: any) =>
                          addTimeOpen({
                            open: value ? dayjs(value)
                              .format("HH:mm") : '',
                            day: index.id,
                          })
                        }
                      />
                      <br />
                      <TimePicker
                        label={t('components.RestaurantForm.closing')}
                        ampm={false}
                        value={dayOpeningHours.close ? dayjs(dayOpeningHours.close, "HH:mm") : null}
                        onChange={(value: any) =>
                          addTimeClose({
                            close: value ? dayjs(value)
                              .format("HH:mm") : '',
                            day: index.id,
                          })
                        }
                      />
                    </FormControl>
                  </Grid>
                </LocalizationProvider>
              );
            })}
            <Grid item xs={2} sm={4} md={6}>
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  defaultValue={website}
                  label={t('components.RestaurantForm.website')}
                  multiline
                  onChange={(e) => (setSelectedWebsite(e.target.value))}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <FormControl fullWidth>
                <Autocomplete
                  id="tags-outlined"
                  options={menuDesigns}
                  value={value}
                  getOptionLabel={(option) =>
                    (option ? (option as IMenuDesigns).name : "")}
                  onChange={(e, value, reason) => {
                    if (reason !== 'clear') {
                      setValue(value);
                      setSelectedMenuDesignId(value._id);
                    } else {
                      setValue(null);
                      setSelectedMenuDesignId(0);
                    }
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('components.RestaurantForm.menu-design')}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2} sm={4} md={6}>
              <FormControl fullWidth>
                <Autocomplete
                  id="tags-outlined"
                  options={restoChains}
                  value={valueRestoChain}
                  getOptionLabel={(option) =>
                    (option ? (option as {uid:number, name:string}).name : "")}
                  onChange={(e, value, reason) => {
                    if (reason !== 'clear') {
                      setValueRestoChain(value);
                      setSelectedRestoChainId(value.uid);
                    } else {
                      setValueRestoChain(null);
                      setSelectedRestoChainId(0);
                    }
                  }}
                  inputValue={inputValueRestoChain}
                  onInputChange={(event, newInputValue) => {
                    setInputValueRestoChain(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('components.RestaurantForm.restoChain')}
                    />
                  )}
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
          {t('common.save')}
        </Button>
      </ThemeProvider>
    </Box>
  );
};

export default RestaurantForm;
