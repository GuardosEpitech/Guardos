This file contains all functions that make dish related requests to our backend.

getAllDishes:
-------------

```java
export const getAllDishes = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all dishes:", error);
    throw new Error("Failed to fetch all dishes");
  }
};
```

addNewDish:
-----------

```java
export const addNewDish = async (restoName: string, body: any) => {
  try {
    const response = await axios({
      url: baseUrl + restoName,
      method: "POST",
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding dish:", error);
    throw new Error("Failed to add dish");
  }
};
```

editDish:
---------

```java
export const editDish = async (restoName: string, body: any) => {
  try {
    const response = await axios({
      url: baseUrl + restoName,
      method: "PUT",
      data: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing dish:", error);
    throw new Error("Failed to edit dish");
  }
};
```

deleteDish:
-----------

```java
export const deleteDish = async (restoName: string, dishName: string) => {
  try {
    const response = await axios({
      url: baseUrl + restoName,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ name: dishName }),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw new Error("Failed to delete dish");
  }
};
```