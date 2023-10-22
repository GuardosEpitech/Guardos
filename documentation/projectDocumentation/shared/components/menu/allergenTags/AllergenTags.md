IAllergenTagsProps:
-------------------

```java
interface IAllergenTagsProps {
  dishAllergens: string[]
}
```

AllergenTags:
-------------

```java
const AllergenTags = (props: IAllergenTagsProps) => {
  const { dishAllergens } = props;

  return (
    <ThemeProvider theme={Tags()}>
      {dishAllergens.length != 0 && dishAllergens.map((allergen) => (
        <Chip
          key={allergen}
          label={allergen}
          color="primary"
          variant="filled"
          size="small"
          className={styles.TagMargin}
        />
      ))}
    </ThemeProvider>
  )
}
```