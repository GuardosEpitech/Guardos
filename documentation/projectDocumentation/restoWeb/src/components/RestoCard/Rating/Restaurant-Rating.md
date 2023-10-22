IRatingProps:
-------------

```java
interface IRatingProps {
  restoRating: number;
  restoRatingsCount: number;
}
```

Rating:
-------

```java
const Rating = (props: IRatingProps) => {
  const { restoRating, restoRatingsCount } = props;
  const fullRating = Math.floor(restoRating);

  return (
    <ThemeProvider theme={RatingColor}>
      {[...Array(fullRating)].map((elem, index) =>
        <ThemeProvider key={index} theme={RatingColor}>
          <StarIcon
            className={styles.StarPosition}
            color="primary"
            key={index}
          />
        </ThemeProvider>
      )}
      {restoRating - fullRating > 0 &&
        <ThemeProvider theme={RatingColor}>
          <StarHalfIcon className={styles.StarPosition} color="primary" />
        </ThemeProvider>
      }
      {[...Array(Math.floor(5 - restoRating))].map((elem, index) => (
        <ThemeProvider key={index} theme={RatingColor}>
          <StarOutlineIcon
            className={styles.StarPosition}
            color={"primary"}
            key={index}
          />
        </ThemeProvider>
      ))}
      <span className={styles.RatingCount}>{`(${restoRatingsCount})`}</span>
    </ThemeProvider>
  );
};
```