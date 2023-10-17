ICategoryProps:
---------------

```java
interface ICategoryProps {
  title: string;
  children: React.ReactNode;
}
```

Category:
---------

```java
const Category = (props: ICategoryProps) => {
  return (
    <div className={styles.CategoryBox}>
      <Divider textAlign={"left"}>
        <h2>
          {props.title}
        </h2>
      </Divider>
      {props.children}
    </div>
  )
}
```