import React, {useEffect, useState} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { IFilterObject } from "shared/models/filterInterfaces";
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
import {addSavedFilter, deleteSavedFilter, getSavedFilters} from "@src/services/profileCalls";

const GlobalStyle = () => {
  return createTheme({
    palette: {
      primary: {
        main: "#AC2A37",
        contrastText: "#ffffff",
      },
    },
    components: {
      MuiChip: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: '#FFFFFF',
            color: "#000000",
            fontFamily: "Montserrat",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "400",
          },
          colorSecondary: {
            backgroundColor: '#AC2A37',
            color: "#ffffff",
            fontFamily: "Montserrat",
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

type color = "primary" | "secondary" | "default" | "error" | "info" | "success" | "warning"

interface category {
  name: string;
  value: boolean;
}

interface allergen {
  name: string;
  value: boolean;
  colorButton: color;
}

interface FilterProps {
  // eslint-disable-next-line
  onChange: Function,
  // eslint-disable-next-line
  onFilterLoad: Function,
  fetchFilter: () => ISearchCommunication,
  filter: ISearchCommunication,
  categories: category[],
  allergens: allergen[]
}

const Filter = (props: FilterProps) => {
  const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/user/allergen`;
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [savedFilters, setSavedFilters] = useState<ISearchCommunication[]>([]);
  const [newFilterName, setNewFilterName] = useState('');
  const [openLoadDialog, setOpenLoadDialog] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [range, setRange] = React.useState(props.filter.range ? props.filter.range : 0);
  const [rating, setRating] = React.useState(props.filter.rating ? props.filter.rating[0] : 0);
  const [categories, setCategories] = useState(props.categories);
  const [allergens, setAllergens] = useState<allergen[]>(props.allergens);
  const [changeStatus, setChangeStatus] = useState(null);
  const [changeStatusMsg, setChangeStatusMsg] = useState('');

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
    setAllergens(updatedAllergens);
    props.onChange(filter, updatedCategories, updatedAllergens);
  }

  const handleClick = async (name: string) => {
    const allergensCopy = [...allergens];
    const allergenListChanged = [];
    // const user = localStorage.getItem('user');

    allergens.map((state, index) => {
      if (name === state.name) {
        allergensCopy[index].value = !allergensCopy[index].value;
        if (allergensCopy[index].colorButton == "primary") {
          allergensCopy[index].colorButton = "secondary";
        } else {
          allergensCopy[index].colorButton = "primary";
        }
      }
    });
    setAllergens(allergensCopy);

    for (let i = 0; i < allergensCopy.length; i++) {
      if (allergensCopy[i].value) {
        allergenListChanged.push(allergensCopy[i].name);
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
  };

  const handleMenuClick = (event: any) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const saveFilter = (filter: ISearchCommunication) => {
    setChangeStatus(null);
    const userToken = localStorage.getItem('user');
    if (userToken === null) {
      return;
    }

    savedFilters.push(filter);
    addSavedFilter(userToken, filter).then((res) => {
      if (res == null) {
        setChangeStatus("failed");
        setChangeStatusMsg("Failed to save filter");
      } else {
        setChangeStatus("success");
        setChangeStatusMsg("Successfully saved filter");
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
    setChangeStatusMsg("Successfully loaded filter");
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

    setRating(newFilter.rating[0]);
    setRange(newFilter.range);

    localStorage.removeItem('filter');

    // Notify parent component
    props.onChange(newFilter, updatedCategories, updatedAllergens);
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
        setChangeStatusMsg("Failed to delete filter");
      } else {
        setChangeStatus("success");
        setChangeStatusMsg("Successfully deleted filter");
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
    setRating(0);
    setRange(0);

    localStorage.removeItem('filter');

    // Notify parent component
    props.onChange(clearedFilter, []);
  };

  return (
    <div className={styles.RectFilter}>
      <div className={styles.DivFilter}>
        <div className={styles.spaceBetween}>
          <div className={styles.DivTitleFilter}>
            <span className={styles.TitleFilter}>Filter by:</span>
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
                label="Filter Name"
                variant="outlined"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
              />
              <Button onClick={handleSaveFilter} variant="contained">
                <Save /> Save Filter
              </Button>
            </MenuItem>
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
                Clear Filter
              </Button>
            </MenuItem>
          </Menu>

          {/* Load Filters Dialog */}
          <Dialog open={openLoadDialog} onClose={() => setOpenLoadDialog(false)}>
            <DialogTitle>Load Filters</DialogTitle>
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
                Cancel
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
          <span className={styles.TitleSubFilter}>Rating:</span>
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
            <span className={styles.TitleSubFilter}>Range:</span>
          </div>
          <div className={styles.DivSlider}>
            <ThemeProvider theme={GlobalStyle()}>
              <Box sx={{ width: "20rem" }}>
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
          <span className={styles.TitleSubFilter}>Categories:</span>
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
            <span className={styles.TitleSubFilter}>Allergens:</span>
          </div>
          <div>
            <Stack className={styles.allergenChips} direction="row" spacing={1}>
              {allergens.map((allergen) => (
                  <ThemeProvider theme={GlobalStyle()} key={allergen.name}>
                    <Chip
                      className={styles.chip}
                      label={allergen.name}
                      color={allergen.colorButton}
                      variant="outlined"
                      onClick={() => handleClick(allergen.name)}
                    />
                  </ThemeProvider>
                )
              )}
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
