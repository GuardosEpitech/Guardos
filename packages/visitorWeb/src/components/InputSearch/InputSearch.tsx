import React from "react";
import styles from "@src/components/InputSearch/InputSearch.module.scss";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FormControl from '@mui/material/FormControl';
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Autocomplete from "@src/components/InputSearchAutocomplete/AutoComplete";
import autoCompleteData from "@src/components/InputSearchAutocomplete/filterDataLocation";
import { ISearchCommunication } from "shared/models/communicationInterfaces";
import { useTranslation } from "react-i18next";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6d071a",
    },
  },
});

const InputSearch = (props: any) => {
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");
  const { t } = useTranslation();

  function onChangeName(event: any) {
    setName(event.target.value);
  }

  function onChangeLocation(event: any) {
    setLocation(event);
  }

  function sendButtonData(name: string, location: string) {
    const inter: ISearchCommunication = {
      name: name,
      location: location,
    };
    props.onChange(inter);
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInput}>
        <ThemeProvider theme={theme}>
          <TextField
            label={t("components.InputSearch.name")}
            className={styles.InputSearch}
            onChange={onChangeName}
            focused
          />
        </ThemeProvider>
        <Autocomplete data={autoCompleteData} onChange={onChangeLocation} />
      </div>
      <ThemeProvider theme={theme}>
        <Button
          variant="contained"
          endIcon={<SearchIcon />}
          onClick={() => sendButtonData(name, location)}
          sx={{
            fontSize: "1rem",
            textTransform: "none",
            "@media (max-width: 1200px)": {
              fontSize: "1rem",
            },
          }}
        >
          {t("components.InputSearch.search")}
        </Button>
      </ThemeProvider>
    </div>
  );
};

export default InputSearch;
