import React, { useRef } from "react";
import { useLocation } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { List, ListItem } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

import Category from "shared/components/menu/Category/Category";
import Dish from "@src/components/menu/Dish/Dish";
import Layout from 'shared/components/Layout/Layout';
import styles from "@src/pages/MenuPage/MenuPage.module.scss";

import { ICategories } from "shared/models/categoryInterfaces";
import pic1 from "../../../../shared/assets/menu-pic1.jpg";
import pic2 from "../../../../shared/assets/menu-pic2.jpg";
import pic3 from "../../../../shared/assets/menu-pic3.jpg";

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
  const { menu, restoName, address, menuDesignID } = useLocation().state;
  const thirdLayout = {
    backgroundColor: 'rgba(255,126,145,0.5)',
    padding: '40px',
    borderRadius: '10px',
  }

  // Create refs for each section
  const sectionRefs = useRef(menu.map(() => React.createRef()));

  // Function to scroll to a section
  const scrollToSection = (index:number) => {
    sectionRefs.current[index].current.scrollIntoView({ behavior: 'smooth' });
  };

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
        {menuDesignID === 0 ? (
          <div>
            {menu.map((category: ICategories) => {
              return (
                <div>
                  {category.dishes.length > 0 && (
                    <Category key={category.name} title={category.name}>
                      {category.dishes.map((dish, index) => {
                        return <Dish key={dish.name + index} dish={dish} />;
                      })}
                    </Category>
                )}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            
          </div>
        )}
        {menuDesignID >= 1 ? (
          <div className={styles.secondLayout} style={menuDesignID === 2 ? thirdLayout : null}>
            <div className={styles.secondLayoutList}>
              <ul>
                {menu.map((category: ICategories, index: number) => {
                  return (
                    <li key={index} onClick={() => scrollToSection(index)} className={styles.secondLayoutListObject}>
                      {category.name}
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className={styles.secondLayoutDishes}>
              {menu.map((category: ICategories, index: number) => {
                return (
                  <div key={index} ref={sectionRefs.current[index]}>
                    {index % 3 === 0 ? (
                      <div style={{ 
                        backgroundImage: `url(${pic1})`
                      }} className={styles.secondLayoutBanner} />
                    ) : (
                      <div/>
                    )}
                    {index % 3 === 1 ? (
                      <div style={{ 
                        backgroundImage: `url(${pic2})`
                      }} className={styles.secondLayoutBanner} />
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
                            return <Dish key={dish.name + index} dish={dish} />;
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
      </Layout>
    </>
  );
};

export default MenuPage;
