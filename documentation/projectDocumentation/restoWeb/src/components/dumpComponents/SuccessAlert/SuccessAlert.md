SuccessAlert:
-------------

```java
const HomePage = () => {
  const [hidden, setHidden] = React.useState(true);
  let successfulForm = useLocation().state?.successfulForm;

  useEffect(() => {
    if (successfulForm === true) {
      setHidden(false);
    }
    successfulForm = false;
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setHidden(true);
  };

  return (
    <Snackbar open={!hidden} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        This is a success message!
      </Alert>
    </Snackbar>
  );
};
```