InputSearch:
------------

```java
const InputSearch = (props: any) => {
  const [name, setName] = React.useState("");
  const [location, setLocation] = React.useState("");


  function onChangeName(event: any) {
    setName(event.target.value);
  }

  function onChangeLocation(event: any) {
    setLocation(event);
  }

  function sendButtonData(name: string, location: string) {
    const inter: ISearchCommunication = {
      name: name,
      location: location
    }
    props.onChange(inter);
  }

  return (
    <div className={styles.DivSearchInput}>
      <ThemeProvider theme={theme}>
        <TextField
          label="Name"
          variant="filled"
          className={styles.InputSearch}
          onChange={onChangeName}
        />
      </ThemeProvider>
      <Autocomplete data={autoCompleteData} onChange={onChangeLocation} />
      <ThemeProvider theme={PageBtn()}>
        <Button
          variant="contained"
          endIcon={<SearchIcon />}
          onClick={() => sendButtonData(name, location)} >
            Search
        </Button>
      </ThemeProvider>
    </div>
  );
};
```