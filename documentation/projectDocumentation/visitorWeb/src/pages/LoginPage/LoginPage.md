LoginUser interface:
--------------------

```java
interface LoginUser {
  username: string;
  password: string;
}
```

initial user state:
-------------------

```java
const initialUserState = {
  username: '',
  password: '',
};
```

Login:
------

```java
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle registration logic here
    try {
      const dataStorage = JSON.stringify({
        username: user.username,
        password: user.password
      });
      const response = await axios({
          method: 'POST',
          url: baseUrl,
          data: dataStorage,
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (response.data === 'Invalid Access') {
        setErrorForm(true);
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('user', JSON.stringify(response.data));
        setErrorForm(false);
        NavigateTo("/", navigate, {
          loginName: user.username
        })
      }
    } catch (error) {
        console.error(`Error in Post Route: ${error}`);
        throw error;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <>
      <Header />
      <Layout>
        <div className={styles.loginForm}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username or Email"
              name="username"
              value={user.username}
              onChange={handleChange}
              margin="normal"
              error={errorForm}
              helperText={errorForm ? 'Invalid Logindata' : ''}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              margin="normal"
              error={errorForm}
              helperText={errorForm ? 'Invalid Logindata' : ''}
            />
            <Button type="submit" variant="contained" color="primary" size='large'>
              Login
            </Button>
            <p className={styles.registerInfo}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Don't you have an account yet? Register yourself <a className={styles.registerLink} onClick={() => NavigateTo('/register', navigate, {})}>here</a>.
            </p>
          </form>
        </div>
      </Layout>
    </>
  );
};
```