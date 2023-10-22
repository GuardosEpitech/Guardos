IEditRestaurantPageProps:
-------------------------

```java
interface IEditRestaurantPageProps {
  restoName: string;
  phone: string;
  street: string;
  streetNumber: number;
  postalCode: string;
  city: string;
  country: string;
  description: string;
}
```

EditRestaurantPage:
-------------------

```java
const EditRestaurantPage = () => {
  const {
    restoName,
    phone,
    street,
    streetNumber,
    postalCode,
    city,
    country,
    description
  } = useLocation().state as IEditRestaurantPageProps;

  return (
    <div>
      <Header />
      <div className={styles.RectOnImg}>
        <span className={styles.TitleSearch}>Edit restaurant</span>
      </div>
      <Layout>
        <RestaurantForm
          restaurantName={restoName}
          phone={phone}
          street={street}
          streetNumber={streetNumber}
          postalCode={postalCode}
          city={city}
          country={country}
          description={description}
        />
      </Layout>
    </div>
  );
};
```