import React from "react";
import styles from "@src/components/InputSearch/InputSearch.module.scss";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
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
  const { name, location, onChange } = props;
  const { t } = useTranslation();

  function onChangeName(event: any) {
    onChange(event.target.value, location);
  }

  function onChangeLocation(event: any) {
    onChange(name, event.target.value);
  }

  function sendButtonData(name: string, location: string) {
    const inter: ISearchCommunication = {
      name: name,
      location: location,
    };
    props.onClick(inter);
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInput}>
        <ThemeProvider theme={theme}>
          <TextField
            label={t("components.InputSearch.name")}
            value={name}
            className={styles.InputSearch}
            onChange={onChangeName}
            focused
          />
        </ThemeProvider>
        <ThemeProvider theme={theme}>
          <TextField
            label={t("components.InputSearch.location")}
            value={location}
            className={styles.InputSearch}
            onChange={onChangeLocation}
            focused
          />
        </ThemeProvider>
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
