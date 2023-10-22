```java
interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  return (
    <div className={styles.OuterColor}>
      <Container maxWidth={"lg"}>
        <div className={styles.InnerColor}>
          {props.children}
        </div>
      </Container>
    </div>
  )
}
```