Header:
-------

```java
const Header = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.BackgroundRect}>
      <span className={styles.NavTitle}>Login</span>
      <span
        className={styles.NavTitle}
        onClick={() => NavigateTo("/", navigate)}
      >
        My Restaurants
      </span>
      <img className={styles.LogoImg} src={logo} alt="Logo" />
      <span
        className={styles.NavTitle}
        onClick={() => NavigateTo("/dishes", navigate)}
      >
        My Dishes
      </span>
      <span
        className={styles.NavTitle}
        onClick={() => NavigateTo("/products", navigate)}
      >
        My Products
      </span>
    </div>
  );
};
```