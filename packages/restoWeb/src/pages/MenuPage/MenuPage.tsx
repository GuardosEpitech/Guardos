
import React, {useEffect, useState, useRef} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { List, ListItem, Button, Popover } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import Category from "shared/components/menu/Category/Category";
import Dish from "@src/components/menu/Dish/Dish";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/MenuPage/MenuPage.module.scss";
import { ICategories } from "shared/models/categoryInterfaces";
import { getQRCodeByName } from "@src/services/qrcodeCall";
import pic1 from "../../../../shared/assets/menu-pic1.jpg";
import pic2 from "../../../../shared/assets/menu-pic2.jpg";
import pic3 from "../../../../shared/assets/menu-pic3.jpg";
import {useTranslation} from "react-i18next";
import {restoByName} from "@src/services/restoCalls";
import { Buffer } from 'buffer';
import DownloadIcon from '@mui/icons-material/Download';

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
  uid: string;
}

const MenuPage = () => {
  const { menu, restoName, address, menuDesignID, uid } = useLocation().state;
  const [restaurantData, setRestaurantData] = useState({uid: 1});
  const [hasMenu, setHasMenu] = useState(false);
  const [QRCODEimg, setQRCODEimg] = useState('');
  const thirdLayout = {
    backgroundColor: 'rgba(255,126,145,0.5)',
    padding: '40px',
    borderRadius: '10px',
  };

  // Create refs for each section
  const sectionRefs = useRef(menu.map(() => React.createRef()));
  const navigate = useNavigate();
  const {t} = useTranslation();
  // Function to scroll to a section
  const scrollToSection = (index:number) => {
    sectionRefs.current[index].current.scrollIntoView({ behavior: 'smooth' });
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    const imgCode = await getQRCodeByName(restaurantData.uid);
    const base64String = Buffer.from(imgCode.qrCodeImage.data)
      .toString('base64');
    setQRCODEimg(`data:image/png;base64,${base64String}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const idPopover = open ? 'simple-popover' : undefined;

  useEffect(() => {
    restoByName(restoName)
      .then(res => setRestaurantData(res));
    const filteredMenu = menu.filter((category: ICategories) =>
      category.dishes.length > 0);
    if (filteredMenu.length > 0) {
      setHasMenu(true);
    }
  }, []);

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
      {hasMenu ? (
        <Layout>
          {menuDesignID === 0 ? (
            <div>
              {menu.map((category: ICategories) => {
                return (
                  <div>
                    {category.dishes.length > 0 && (
                      <Category key={category.name} title={category.name}>
                        {category.dishes.map((dish, index) => {
                          return <Dish key={dish.name + index} dish={dish} editable={true} isTopLevel={true}/>;
                        })}
                      </Category>
                    )}
                    <div>
                      {category.dishes.length > 0 && (
                        <Category key={category.name} title={category.name}>
                          {category.dishes.map((dish, index) => {
                            return <Dish key={dish.name + index} dish={dish} editable={true}
                              isTopLevel={true}/>;
                          })}
                        </Category>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>

            </div>
          )}
          {menuDesignID >= 1 ? (
            <div className={`${styles.secondLayout} ${menuDesignID === 3 ? styles.fancyLayout : ''}`}
              style={menuDesignID === 2 ? thirdLayout : null}>
              <div className={styles.secondLayoutList}>
                <ul>
                  {menu.filter((category: ICategories) => category.dishes.length > 0)
                    .map((category: ICategories, index: number) => {
                      return (
                        <li key={index} onClick={() => scrollToSection(index)}
                          className={styles.secondLayoutListObject}>
                          {category.name}
                        </li>
                      );
                    }
                    )}
                </ul>
              </div>
              <div className={styles.secondLayoutDishes}>
                {menu.filter((category: ICategories) => category.dishes.length > 0)
                  .map((category: ICategories, index: number) => {
                    return (
                      <div key={index} ref={sectionRefs.current[index]}>
                        {index % 3 === 0 ? (
                          <div style={{
                            backgroundImage: `url(${pic1})`
                          }} className={styles.secondLayoutBanner}/>
                        ) : (
                          <div/>
                        )}
                        {index % 3 === 1 ? (
                          <div style={{
                            backgroundImage: `url(${pic2})`
                          }} className={styles.secondLayoutBanner}/>
                        ) : (
                          <div/>
                        )}
                        {index % 3 === 2 ? (
                          <div style={{
                            backgroundImage: `url(${pic3})`
                          }} className={styles.secondLayoutBanner}/>
                        ) : (
                          <div/>
                        )}
                        <div>
                          {category.dishes.length > 0 && (
                            <Category key={category.name} title={category.name}>
                              {category.dishes.map((dish, index) => {
                                return <Dish key={dish.name + index} dish={dish} editable={true}
                                  isTopLevel={true}/>;
                              })}
                            </Category>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div>

            </div>
          )}
          <div>
            <Button
              aria-describedby={idPopover}
              className={styles.SaveBtn}
              variant="contained"
              sx={{width: "12.13rem"}} onClick={handleClick}
            >
              {t('pages.MenuPage.qr-code')}
            </Button>
            <Popover
              id={idPopover}
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <div className={styles.Popover}>
                <img src={QRCODEimg} alt="QR Code"/>
                <a href={QRCODEimg} download="QRCode.png">
                  <DownloadIcon color={"action"} />
                </a>
              </div>
            </Popover>
          </div>
        </Layout>
      ) : (
        <Layout>
          <h2 className={styles.NoMenu}>
            {t('pages.MenuPage.no-menu')}
          </h2>
        </Layout>
      )}
    </>
  );
};

export default MenuPage;
