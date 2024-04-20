import React from "react";
import styles from "@src/components/InputSearch/InputSearch.module.scss";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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
    <div className={styles.DivSearchInput}>
      <ThemeProvider theme={theme}>
        <TextField
          label={t("components.InputSearch.name")}
          variant="filled"
          className={styles.InputSearch}
          onChange={onChangeName}
        />
      </ThemeProvider>
      <Autocomplete data={autoCompleteData} onChange={onChangeLocation} />
      <ThemeProvider theme={theme}>
        <Button
          variant="contained"
          endIcon={<SearchIcon />}
          onClick={() => sendButtonData(name, location)}
          sx={{
            fontSize: "1.13rem",
            "@media (max-width: 768px)": {
              fontSize: "0.7rem",
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
