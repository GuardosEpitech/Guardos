AppOutlet:
----------

```java
const AppOutlet = () => {
  return (
    <>
      <Outlet />
      <div className={styles.Container}>
        <div className={styles.TextContainer}>
          <h2 className={styles.ContactTitle}>Contact:</h2>
          <ul className={styles.ListContact}>
            <li>Email: contact@guardos.com</li>
            <li>Phone: +49 211 1234567</li>
            <li>Location: contact@guardos.com</li>
          </ul>
        </div>
      </div>
    </>
  );
};
```