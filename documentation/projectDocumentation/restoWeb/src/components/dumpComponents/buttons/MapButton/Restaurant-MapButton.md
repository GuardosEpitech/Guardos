MapButton:
----------

```java
const MapButton = () => {
  return (
    <div className={styles.DivRect}>
      <ThemeProvider theme={MapBtn()}>
        <Button variant="contained" sx={{ width: "15.44rem" }}>
          Go To Map View
        </Button>
      </ThemeProvider>
    </div>
  );
};
```