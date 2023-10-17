MVPRouter:
----------

```java
const MVPRouter = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};
```

Add a new route:
----------------

First you must import the page you want to add.

```java
imprort CreatedPage from "@src/pages/CreatedPage";
```

Then simply add your page between ‘<Routes></Routes>’.

```java
<Route path="/nameOfRoute" element={<CreatedPage />} />
```