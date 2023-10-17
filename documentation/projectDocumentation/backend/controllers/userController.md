This file contains all related function for handling the user.

addUser():
----------

```java
export async function addUser(username: string, 
  email: string, password: string) {

  const errorArray = [false, false];
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const upload = new UserSchema({
    username: username,
    email: email,
    password: password,
    allergens: []
  });
  const existingUsername = await UserSchema.findOne({ username: username })
    .exec();
  const existingEmail = await UserSchema.findOne({ email: email })
    .exec();

  if (existingEmail) {
    errorArray[0] = true;
  }
  if (existingUsername) {
    errorArray[1] = true;
  }
  if (errorArray.includes(true)) {
    return errorArray;
  }
  await upload.save();
  return errorArray;
}
```

This function takes the username, password and user email as arguments and uploads it to our database.

loginUser():
------------

```java
export async function loginUser(username: string, 
  password: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.find();
  for (const elem of userData) {
    if ((elem.username === username || 
      elem.email === username) && elem.password === password) {
      return true;
    }
  }
  return false;
}
```

This function takes the username and password as arguments and returns either true or false, depending on the existence of the user in our database.

getAllergens():
---------------

```java
export async function getAllergens(email: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.findOne({email: email})
    .exec();
  return userData;
}
```

This function takes the user email as argument and returns all allergens that are registered to that user.

updateAllergens():
------------------

```java
export async function updateAllergens(email: string, allergens: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.findOneAndUpdate({email: email}, {allergens: JSON.parse(allergens)}, {new: true});
  return userData;
}
```

This function takes the user email and and an allergen as arguments. It will then get the user data and update the allergens that are registered to that user. The function will then return the user data.