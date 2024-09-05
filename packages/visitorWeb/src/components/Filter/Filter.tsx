import React, {useEffect, useState} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { IFilterObject } from "shared/models/filterInterfaces";
import { AllergenProfile, color, Allergen } from "shared/models/restaurantInterfaces";
import axios from 'axios';
import styles from "./Filter.module.scss";
import {Button, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Menu, Rating} from "@mui/material";
import {Delete, Edit, MoreVert, Save} from "@mui/icons-material";
import DownloadIcon from '@mui/icons-material/Download';
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {ISearchCommunication} from "backend/src/models/communicationInterfaces";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {addSavedFilter, deleteSavedFilter, getSavedFilters, getSavedFilterLimit} from "@src/services/profileCalls";
import {useTranslation} from "react-i18next";
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import AddIcon from '@mui/icons-material/Add';

const GlobalStyle = () => {
  return createTheme({
    palette: {
      primary: {
        main: "#AC2A37",
        contrastText: "#ffffff",
      },
    },
    components: {
      MuiTab: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: '#AC2A37'
            }
          }
        }
      },
      MuiChip: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: '#FFFFFF',
            color: "#000000",
            fontFamily: "Calibri",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "400",
          },
          colorSecondary: {
            backgroundColor: '#AC2A37',
            color: "#ffffff",
            fontFamily: "Calibri",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "400",
            "&&:hover": {
              backgroundColor: '#C46973'
            }
          },
        },
      },
    },
  });
};

const marks = [
  {
    value: 0,
    label: '0 km',
  },
  {
    value: 100,
    label: '100 km',
  },
];

interface category {
  name: string;
  value: boolean;
}

interface FilterProps {
  // eslint-disable-next-line
  onChange: Function,
  // eslint-disable-next-line
  onFilterLoad: Function,
  fetchFilter: () => ISearchCommunication,
  filter: ISearchCommunication,
  categories: category[],
  allergens: Allergen[],
}

const Filter = (props: FilterProps) => {
  const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/user/allergen`;
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [savedFilters, setSavedFilters] = useState<ISearchCommunication[]>([]);
  const [filterLimit, setFilterLimit] = useState<number | null>(null);
  const [newFilterName, setNewFilterName] = useState('');
  const [openLoadDialog, setOpenLoadDialog] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [range, setRange] = React.useState(props.filter.range ? props.filter.range : 0);
  const [rating, setRating] = React.useState(props.filter.rating ? props.filter.rating[0] : 0);
  const [categories, setCategories] = useState(props.categories);
  const [allergens, setAllergens] = useState<Allergen[]>(props.allergens);
  const [changeStatus, setChangeStatus] = useState(null);
  const [changeStatusMsg, setChangeStatusMsg] = useState('');
  const [groupProfiles, setGroupProfiles] = useState<AllergenProfile[]>([{ name: "Me", allergens: allergens }]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState("0");
  const [defaultAllergens, setDefaultAllergens] = useState([]);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const {t} = useTranslation();
  const userProfileName = t('common.me');

  useEffect(() => {
    fetchSavedFilters();
    loadCurFilter();
  }, []);

  const fetchSavedFilters = () => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) { return; }
    getSavedFilters(userToken)
      .then((res) => {
        setSavedFilters(res);
      });

    getSavedFilterLimit(userToken)
      .then((res) => {
        setFilterLimit((res && res.filterLimit) ? res.filterLimit : 0);
      });
  };

  const loadCurFilter = () => {
    const filter = props.fetchFilter();
    setRating(filter.rating[0]);
    setRange(filter.range);

    const updatedCategories = categories.map(category => ({
      ...category,
      value: false
    }));
    for (let i = 0; i < filter.categories.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        if (filter.categories[i] === categories[j].name) {
          updatedCategories[j].value = true;
          break;
        }
      }
    }
    setCategories(updatedCategories);

    const updatedAllergens = allergens.map(allergen => ({
      ...allergen,
      colorButton: "primary" as color,
      value: false
    }))
    for (let i = 0; i < filter.allergenList.length; i++) {
      for (let j = 0; j < allergens.length; j++) {
        if (filter.allergenList[i] === allergens[j].name) {
          updatedAllergens[j].value = true;
          updatedAllergens[j].colorButton = "secondary";
          break;
        }
      }
    }
    setDefaultAllergens(updatedAllergens);
    setAllergens(updatedAllergens);
    setGroupProfiles([{
      name: userProfileName,
      allergens: updatedAllergens
    }])
    props.onChange(filter, updatedCategories, updatedAllergens);
    localStorage.setItem('groupProfiles', JSON.stringify([{ name: userProfileName, allergens: updatedAllergens }]));
  }

  const handleClick = async (name: string) => {
    const curAllergens = [...groupProfiles[Number(selectedProfileIndex)].allergens];
    const allergensCopy = [...groupProfiles[Number(selectedProfileIndex)].allergens];
    const allergenListChanged: string[] = [];
    // const user = localStorage.getItem('user');

    curAllergens.map((state, index) => {
      if (name === state.name) {
        allergensCopy[index].value = !allergensCopy[index].value;
        if (allergensCopy[index].colorButton == "primary") {
          allergensCopy[index].colorButton = "secondary";
        } else {
          allergensCopy[index].colorButton = "primary";
        }
      }
    });
    const newGroupProfiles = [...groupProfiles];
    newGroupProfiles[Number(selectedProfileIndex)].allergens = allergensCopy;
    setGroupProfiles(newGroupProfiles);
    setAllergens(allergensCopy);

    for (let i = 0; i < groupProfiles.length; i++) {
      const allergens = (i === Number(selectedProfileIndex)) ? allergensCopy : groupProfiles[i].allergens;
      for (let j = 0; j < allergens.length; j++) {
        if (allergens[j].value && !allergenListChanged.includes(allergens[j].name)) {
          allergenListChanged.push(allergens[j].name);
        }
      }
    }
    const inter: IFilterObject = {
      allergenList: allergenListChanged
    }

    // TODO: fix this route (we are not using username but token now)
    // if (user !== null) {
    //   const dataStorage = JSON.stringify({
    //     username: JSON.parse(user).username,
    //     allergens: JSON.stringify(allergenListChanged)
    //   });
    //   localStorage.setItem('allergens', JSON.stringify(allergenListChanged));
    //
    //   const response = await axios({
    //     method: 'POST',
    //     url: baseUrl + '/update',
    //     data: dataStorage,
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //   });
    // }

    props.onChange(inter, allergensCopy);
    localStorage.setItem('groupProfiles', JSON.stringify(newGroupProfiles));
  };

  const handleMenuClick = (event: any) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const saveFilter = async (filter: ISearchCommunication) => {
    setChangeStatus(null);
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    addSavedFilter(userToken, filter).then((res) => {
      if (!res || !filter.filterName || res.status == 500) {
        setChangeStatus("failed");
        setChangeStatusMsg(t('components.Filter.save-filter-failure'));
        setNewFilterName("");
      } else if (res.status == 203) {
        setChangeStatus("failed");
        setChangeStatusMsg(t('components.Filter.save-filter-limit-reached'));
        setNewFilterName("");
      } else {
        savedFilters.push(filter);
        setChangeStatus("success");
        setChangeStatusMsg(t('components.Filter.save-filter-success'));
        setNewFilterName("");
      }
    })
  };

  const handleSaveFilter = () => {
    const curFilter : ISearchCommunication = props.fetchFilter();
    saveFilter({
      filterName: newFilterName,
      range: curFilter.range,
      rating: curFilter.rating,
      name: curFilter.name,
      location: curFilter.location,
      categories: curFilter.categories,
      allergenList: curFilter.allergenList
    });
    handleMenuClose();
  };

  const handleLoadFilter = (filterName: string) => {
    const newFilter : ISearchCommunication = savedFilters
      .find((filter) => filter.filterName === filterName);

    localStorage.setItem('filter', JSON.stringify(newFilter));
    setChangeStatus("success");
    setChangeStatusMsg(t('components.Filter.load-filter-success'));
    props.onFilterLoad(newFilter);

    const updatedCategories = categories.map(category => ({
      ...category,
      value: false
    }));
    for (let i = 0; i < newFilter.categories.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        if (newFilter.categories[i] === categories[j].name) {
          updatedCategories[j].value = true;
        }
      }
    }
    setCategories(updatedCategories);

    const updatedAllergens = allergens.map(allergen => ({
      ...allergen,
      colorButton: "primary" as color,
      value: false
    }))
    for (let i = 0; i < newFilter.allergenList.length; i++) {
      for (let j = 0; j < allergens.length; j++) {
        if (newFilter.allergenList[i] === allergens[j].name) {
          updatedAllergens[j].value = true;
          updatedAllergens[j].colorButton = "secondary";
        }
      }
    }
    setAllergens(updatedAllergens);
    setGroupProfiles([{
      name: userProfileName,
      allergens: updatedAllergens
    }])

    setRating(newFilter.rating[0]);
    setRange(newFilter.range);

    localStorage.removeItem('filter');

    // Notify parent component
    props.onChange(newFilter, updatedCategories, updatedAllergens);
    localStorage.setItem('groupProfiles', JSON.stringify([{ name: userProfileName, allergens: updatedAllergens }]));
    handleMenuClose();
  }

  const handleDeleteFilter = (filterName: string) => {
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    deleteSavedFilter(userToken, filterName).then((res) => {
      if (res == null) {
        setChangeStatus("failed");
        setChangeStatusMsg(t('components.Filter.delete-filter-failure'));
      } else {
        setChangeStatus("success");
        setChangeStatusMsg(t('components.Filter.delete-filter-success'));
        const remainingFilters = savedFilters.filter((filter) => filter.filterName !== filterName);
        setSavedFilters(remainingFilters);
      }
    });
    handleMenuClose();
  };

  function onChangeStates(toChange: string) {
    const categoriesCopy = [...categories];
    const categoriesSelected = [];

    categories.map((state, index) => {
      if (toChange === state.name) {
        categoriesCopy[index].value = !categoriesCopy[index].value;
      }
    });

    setCategories(categoriesCopy);

    for (let i = 0; i < categoriesCopy.length; i++) {
      if (categoriesCopy[i].value == true) {
        categoriesSelected.push(categoriesCopy[i].name);
      }
    }
    const inter: IFilterObject = {
      categories: categoriesSelected
    }

    props.onChange(inter, categoriesCopy);
  }

  function onChangeRating(event: any) {
    const inter: IFilterObject = {
      rating: [event.target.value, 5]
    }
    setRating(event.target.value);
    props.onChange(inter);
  }

  function onChangeRange(event: any) {
    const inter: IFilterObject = {
      range: event.target.value
    }
    setRange(event.target.value);
    props.onChange(inter);
  }

  useEffect(() => {
    const fetchData = async () => {
      const user = localStorage.getItem('user');
      const dataStorage = JSON.stringify({
        username: JSON.parse(user).username
      });

      const response = await axios({
        method: 'POST',
        url: baseUrl + '/get',
        data: dataStorage,
        headers: {
            'Content-Type': 'application/json',
        },
      });
      
      const allergensCopy = [...allergens];

      if (response.data.allergens) {
        allergens.map((state, index) => {
          response.data.allergens.map((stateAllergens:string, indexAllergens:number) => {
            if (stateAllergens === state.name) {
              allergensCopy[index].value = !allergensCopy[index].value;
              if (allergensCopy[index].colorButton == "primary") {
                allergensCopy[index].colorButton = "secondary";
              } else {
                allergensCopy[index].colorButton = "primary";
              }
            }
          })
        });
        setAllergens(allergensCopy);
        const groupFilterCopy = groupProfiles;
        groupFilterCopy[0].allergens = allergensCopy;
        setGroupProfiles(groupFilterCopy);
      }
      setIsLoaded(true);
    }
    if (!isLoaded) {
      fetchData().catch(console.error);
    }
  });

  const handleClearFilter = () => {
    // default values
    const clearedFilter: IFilterObject = {
      rating: [0, 0],
      range: 0,
      categories: [],
      allergenList: [],
      location: '',
      name: ''
    };

    // Reset UI state
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({ ...category, value: false }))
    );
    setAllergens((prevAllergens) =>
      prevAllergens.map((allergen) => ({ ...allergen, colorButton: "primary", value: false }))
    );
    setGroupProfiles([{
      name: userProfileName,
      allergens: defaultAllergens
    }])
    setRating(0);
    setRange(0);

    localStorage.removeItem('filter');

    // Notify parent component
    props.onChange(clearedFilter, []);
    localStorage.setItem('groupProfiles', JSON.stringify([{ name: userProfileName, allergens: defaultAllergens }]));
  };

  const handleRemoveProfile = (index: number) => {
    const remainingProfiles = groupProfiles.filter((_, i) => i !== index);
    const allergenListChanged: string[] = [];
    setGroupProfiles(remainingProfiles);
    if (Number(selectedProfileIndex) === index && groupProfiles.length > 1) {
      setSelectedProfileIndex(index === 0 ? String(0) : String(index - 1));
    }

    for (let i = 0; i < remainingProfiles.length; i++) {
      const allergens = remainingProfiles[i].allergens;
      for (let j = 0; j < allergens.length; j++) {
        if (allergens[j].value && !allergenListChanged.includes(allergens[j].name)) {
          allergenListChanged.push(allergens[j].name);
        }
      }
    }
    const inter: IFilterObject = {
      allergenList: allergenListChanged
    }
    props.onChange(inter, remainingProfiles[0].allergens);
    localStorage.setItem('groupProfiles', JSON.stringify(remainingProfiles));
  };

  const handleProfileChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedProfileIndex(String(newValue));
  };

  const handleAddProfile = () => {
    setOpenProfileDialog(true);
  };

  const handleProfileSave = () => {
    if (newProfileName && !groupProfiles.some(profile => profile.name === newProfileName)) {
      setGroupProfiles([
        ...groupProfiles,
        { name: newProfileName, allergens: allergens.map(allergen => ({ ...allergen, value: false, colorButton: "primary" })) }
      ]);
      setSelectedProfileIndex(String(groupProfiles.length));
    }
    setNewProfileName('');
    setOpenProfileDialog(false);
  };

  const handleProfileCancel = () => {
    setNewProfileName('');
    setOpenProfileDialog(false);
  };

  return (
    <div className={styles.RectFilter}>
      <div className={styles.DivFilter}>
        <div>
          <div className={styles.DivTitleFilter}>
            <span className={styles.TitleFilter}>{t('components.Filter.filter-by')}</span>
          <IconButton
            aria-label="filter-menu"
            aria-controls="filter-menu"
            aria-haspopup="true"
            className={styles.iconRight}
            onClick={handleMenuClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="filter-menu"
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem>
              <TextField
                label={t('components.Filter.filter-name') as string}
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                focused
                fullWidth
              />
            </MenuItem>
            <div className={styles.filterLimit}>
              {t('components.Filter.saved-filters', { used: savedFilters.length, limit: filterLimit })}
            </div>
            {savedFilters.map((filter, index) => (
              <MenuItem key={index}>
                <span>{filter.filterName}</span>
                <IconButton onClick={() => handleLoadFilter(filter.filterName)}>
                  <DownloadIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteFilter(filter.filterName)}>
                  <Delete />
                </IconButton>
              </MenuItem>
            ))}
            <MenuItem>
              <Button onClick={handleClearFilter} variant="contained" color="secondary">
                {t('components.Filter.clear-filter')}
              </Button>
              <Button onClick={handleSaveFilter} variant="contained" className={styles.saveFilter}>
                <Save /> {t('components.Filter.save-filter')}
              </Button>
            </MenuItem>
          </Menu>

          {/* Load Filters Dialog */}
          <Dialog open={openLoadDialog} onClose={() => setOpenLoadDialog(false)}>
            <DialogTitle>{t('components.Filter.load-filters')}</DialogTitle>
            <DialogContent>
              <List>
                {savedFilters.map((filter, index) => (
                  <ListItem button key={index}>
                    <ListItemText primary={filter.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="load"
                        onClick={() => {
                          setOpenLoadDialog(false);
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenLoadDialog(false)} color="primary">
                {t('common.cancel')}
              </Button>
            </DialogActions>
          </Dialog>
          </div>
        </div>

        {changeStatus !== null && (
          <span style={{ color: changeStatus === 'success' ? 'green' : 'red' }}>
                {changeStatusMsg}
              </span>
        )}

        <div className={styles.DivRatingBox}>
          <span className={styles.TitleSubFilter}>{t('components.Filter.rating')}</span>
          <div className={styles.DivRating}>
            <Box component="fieldset" borderColor="transparent">
              <Rating
                name="dynamic-rating"
                value={rating}
                precision={1}
                onChange={onChangeRating}
              />
            </Box>
          </div>
        </div>
        <div className={styles.DivRange}>
          <div>
            <span className={styles.TitleSubFilter}>{t('components.Filter.range')}</span>
          </div>
          <div className={styles.DivSlider}>
            <ThemeProvider theme={GlobalStyle()}>
              <Box sx={{ width: "20rem" }} className={styles.sliderWidth}>
                <Slider 
                  defaultValue={100}
                  value={range}
                  color="primary"
                  marks={marks}
                  valueLabelDisplay="on"
                  onChange={(event) => onChangeRange(event)}
                />
              </Box>
            </ThemeProvider>
          </div>
        </div>
        <div className={styles.DivCategoriesBox}>
          <span className={styles.TitleSubFilter}>{t('components.Filter.categories')}</span>
          <div className={styles.DivCategories}>
            {categories.map((category) => (
              <ThemeProvider theme={GlobalStyle()} key={category.name}>
                <FormControlLabel
                  control={<Checkbox checked={category.value} defaultChecked={category.value} />}
                  label={<span className={styles.TitleCheck}>{category.name}</span>}
                  onChange={() => onChangeStates(category.name)}
                />
              </ThemeProvider>
            ))}
          </div>
        </div>
        <div className={styles.DivAller}>
          <div className={styles.DivTitleAller}>
            <span className={styles.TitleSubFilter}>{t('components.Filter.allergens')}</span>
          </div>
          <div>
            <ThemeProvider theme={GlobalStyle()}>
              <TabContext value={selectedProfileIndex}>
                <TabList onChange={handleProfileChange} variant={"scrollable"} aria-label="Allergen profiles">
                  {groupProfiles.map((profile, index) => (
                    <Tab key={index} label={profile.name} value={String(index)} />
                  ))}
                  <IconButton onClick={handleAddProfile}>
                    <AddIcon/>
                  </IconButton>
                </TabList>
                {groupProfiles.map((profile, index) => (
                  <TabPanel style={{padding: 0, paddingTop: 24}} key={index} value={String(index)}>
                    <Stack className={styles.allergenChips} direction="row" spacing={1}>
                      {profile.allergens.map((allergen, allergenIndex) => (
                        <ThemeProvider theme={GlobalStyle()} key={allergen.name}>
                          <Chip
                          className={styles.chip}
                          label={allergen.name}
                          color={allergen.colorButton}
                          variant="outlined"
                          onClick={() => handleClick(allergen.name)}
                          />
                        </ThemeProvider>
                      ))}
                    </Stack>
                    {selectedProfileIndex !== "0" && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleRemoveProfile(index)}
                        startIcon={<Delete />}
                      >
                        Remove Profile
                      </Button>
                    )}
                  </TabPanel>
                ))}
              </TabContext>
              <Dialog open={openProfileDialog} onClose={handleProfileCancel}>
                <DialogTitle>Add New Profile</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Profile Name"
                    fullWidth
                    variant="outlined"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleProfileCancel} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleProfileSave} color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
