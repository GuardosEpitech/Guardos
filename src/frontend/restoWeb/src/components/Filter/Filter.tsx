import React, { useState } from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";

import styles from "./Filter.module.scss";

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
            backgroundColor: "#FFFFFF",
            color: "#000000",
            fontFamily: "Montserrat",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "400",
          },
          colorSecondary: {
            backgroundColor: "#AC2A37",
            color: "#ffffff",
            fontFamily: "Montserrat",
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: "400",
          },
        },
      },
    },
  });
};

type color =
  | "primary"
  | "secondary"
  | "default"
  | "error"
  | "info"
  | "success"
  | "warning";

const Filter = () => {
  const [colorChip, setColorChip] = useState<color>("primary");
  const handleClick = () => {
    if (colorChip === "primary") setColorChip("secondary");
    if (colorChip === "secondary") setColorChip("primary");
  };

  return (
    <div className={styles.RectFilter}>
      <div className={styles.DivFilter}>
        <div className={styles.DivTitleFilter}>
          <span className={styles.TitleFilter}>Filter by:</span>
        </div>
        <div className={styles.DivRating}>
          <span className={styles.TitleSubFilter}>Rating:</span>
          {[1, 2, 3, 4, 5].map((item) => (
            <ThemeProvider key={item} theme={GlobalStyle()}>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label={
                  <span className={styles.TitleCheck}>
                    {`${item} stars`}
                  </span>
                }
              />
            </ThemeProvider>
          ))}
        </div>
        <div className={styles.DivRange}>
          <div>
            <span className={styles.TitleSubFilter}>Range:</span>
            <span className={styles.TitleRangeValue}>30 km</span>
          </div>
          <div className={styles.DivSlider}>
            <ThemeProvider theme={GlobalStyle()}>
              <Box sx={{ width: "20rem" }}>
                <Slider defaultValue={30} color="primary" />
              </Box>
            </ThemeProvider>
          </div>
        </div>
        <div className={styles.DivAller}>
          <div className={styles.DivTitleAller}>
            <span className={styles.TitleSubFilter}>Allergens:</span>
          </div>
          <div>
            <Stack direction="row" spacing={1}>
              {["Gluten", "Lactose", "Egg", "Fish"].map((item) => (
                <ThemeProvider key={item} theme={GlobalStyle()}>
                  <Chip
                    label={item}
                    color={colorChip}
                    variant="outlined"
                    onClick={handleClick}
                  />
                </ThemeProvider>
              ))}
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
