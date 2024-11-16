import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Chip, Tooltip, MenuItem,
  Select, FormControl, InputLabel, Container } from "@mui/material";
import styles from "@src/pages/ProductsPage/ProductsPage.module.scss";
import { useTranslation } from "react-i18next";
import { getRestoStatistics } from "@src/services/statisticsCalls";
import { getAllRestaurantsByUser } from "@src/services/restoCalls";

const UserInsights = () => {
  const { t } = useTranslation();
  const [userStatistics, setUserStatistics] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const getStatistics = async () => {
    try {
      const userToken = localStorage.getItem("user");
      const response = await getRestoStatistics(userToken);
      const restaurants = await getAllRestaurantsByUser({ key: userToken });
      for (let i = 0; i < restaurants.length; i++) {
        response[i].restoId = restaurants[i].name;
      }
      setUserStatistics(response);
      console.log("user statistics fetched", response);
      if (response.length > 0) {
        setSelectedRestaurant(response[0].restoId);
      }
    } catch (error) {
      console.error("Error fetching the statistics:", error);
    }
  };

  useEffect(() => {
    getStatistics();
  }, []);
  //@ts-ignore
  const handleRestaurantChange = (event) => {
    setSelectedRestaurant(event.target.value);
  };
  //@ts-ignore
  const renderAllergens = (allergens) => { //@ts-ignore
    return allergens.map((allergen, index) => (
      <Tooltip key={index} title={t("food-allergene." + allergen.allergen) + ` (${allergen.count})`}>
        <Chip
          label={t("food-allergene." + allergen.allergen)}
          style={{
            marginRight: "8px",
            marginBottom: "8px",
            backgroundColor: "#e26627"
          }}
          color="primary"
        />
      </Tooltip>
    ));
  };
  //@ts-ignore
  const renderDislikedIngredients = (ingredients) => { //@ts-ignore
    return ingredients.map((ingredient, index) => (
      <Tooltip
        key={index}
        title={`${ingredient.ingredient} (${ingredient.count})`}>
        <Chip
          label={ingredient.ingredient}
          style={{ 
            marginRight: "8px", 
            marginBottom: "8px", 
            backgroundColor: "#fca41e" }}
          color="secondary"
        />
      </Tooltip>
    ));
  };

  const renderStatistics = () => {
    const selectedStats = userStatistics.find(
      (stats) => stats.restoId === selectedRestaurant
    );

    if (!selectedStats) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box",
            minHeight: "150px"
          }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {t("pages.userInsights.total-clicks")}
              </Typography>
              <Typography variant="h4" color="textPrimary">
                {selectedStats.totalClicks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box",
            minHeight: "150px"
          }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {t("pages.userInsights.clicks-this-month")}
              </Typography>
              <Typography variant="h4" color="textPrimary">
                {selectedStats.clicksThisMonth}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box",
            minHeight: "150px"
          }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {t("pages.userInsights.clicks-this-week")}
              </Typography>
              <Typography variant="h4" color="textPrimary">
                {selectedStats.clicksThisWeek}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box",
            minHeight: "150px"
          }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {t("pages.userInsights.update-month")}
              </Typography>
              <Typography variant="body1">
                {selectedStats.updateMonth}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "16px",
            boxSizing: "border-box",
            minHeight: "150px"
          }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {t("pages.userInsights.update-week")}
              </Typography>
              <Typography variant="body1">
                {selectedStats.updateWeek}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card style={{
            padding: "16px",
            boxSizing: "border-box",
            minHeight: "150px" }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {t("pages.userInsights.user-allergens")}
              </Typography>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {renderAllergens(selectedStats.userAllergens)}
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card style={{
            padding: "16px",
            boxSizing: "border-box",
            minHeight: "150px" }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {t("pages.userInsights.user-disliked-ingredients")}
              </Typography>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {renderDislikedIngredients(
                  selectedStats.userDislikedIngredients)}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Container
      maxWidth={false}
      className={styles.dashboard}
      style={{ paddingLeft: "24px", paddingRight: "24px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card style={{ 
            textAlign: "center",
            marginBottom: "24px",
            padding: "16px" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {t("common.my-analytics")}
              </Typography>
              <FormControl fullWidth style={{ marginTop: "16px" }}>
                <InputLabel id="select-restaurant-label">
                  {t("pages.userInsights.select-restaurant")}
                </InputLabel>
                <Select
                  labelId="select-restaurant-label"
                  value={selectedRestaurant}
                  onChange={handleRestaurantChange}
                  label={t("pages.userInsights.select-restaurant")}
                  variant="outlined"
                >
                  {userStatistics.map((stats, index) => (
                    <MenuItem key={index} value={stats.restoId}>
                      {stats.restoId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        {renderStatistics()}
      </Grid>
    </Container>
  );
};

export default UserInsights;
