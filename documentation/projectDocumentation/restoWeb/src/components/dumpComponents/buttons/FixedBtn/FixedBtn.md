IFixedBtnProps:
---------------

```java
interface IFixedBtnProps {
  title: string;
  redirect: string;
}
```

FixedBtn:
---------

```java
const FixedBtn = (props: IFixedBtnProps) => {
  const navigate = useNavigate();
  const { title, redirect } = props;

  return (
    <div className={styles.FixedBtn}>
      <ThemeProvider theme={PageBtn()}>
        <Button
          variant="contained"
          sx={{ width: "15.13rem" }}
          onClick={() => NavigateTo(redirect, navigate)}
        >
          {title}
        </Button>
      </ThemeProvider>
    </div>
  );
};
```