import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, List, ListItem } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

import Category from "shared/components/menu/Category/Category";
import Dish from "@src/components/menu/Dish/Dish";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/MenuPage/MenuPage.module.scss";

import { ICategories } from "shared/models/categoryInterfaces";
import { getQRCodeByName } from "@src/services/qrcodeCall";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FAFAFA",
    },
  },
});

interface IMenuPageProps {
  menu: [ICategories];
  restoName: string;
  address: string;
  menuDesignID: number;
}

const MenuPage = () => {
  const { menu, restoName, address } = useLocation().state as IMenuPageProps;
  const [URL, setURL] = useState(null);
  const navigate = useNavigate();

  useState(() => {
    getQRCodeByName(restoName)
      .then(res => setURL(res));
  });

  return (
    <>
      <div className={styles.RectOnImg}>
        <List>
          <ListItem>
            <h2 className={styles.RestaurantTitle}>{restoName}</h2>
          </ListItem>
          <ListItem>
            <div className={styles.Address}>
              <ThemeProvider theme={theme}>
                <PlaceIcon color="primary" />
              </ThemeProvider>
              <span className={styles.RestaurantAddress}>{address}</span>
            </div>
          </ListItem>
        </List>
      </div>
      <Layout>
        {menu.map((category) => {
          return (
            category.dishes.length > 0 && (
              <Category key={category.name} title={category.name}>
                {category.dishes.map((dish, index) => {
                  return <Dish key={dish.name + index} dish={dish} />;
                })}
              </Category>
            )
          );
        })}
        <Button
          className={styles.SaveBtn}
          variant="contained"
          sx={{width: "12.13rem"}}
          onClick={() => window.location.href = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/qrcode/base64/${URL.name}`}
        >
          Get my Menu QRCODE
        </Button>
      </Layout>
    </>
  );
};

export default MenuPage;
