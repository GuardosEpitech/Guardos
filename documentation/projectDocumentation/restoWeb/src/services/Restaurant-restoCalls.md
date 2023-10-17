This file contains all functions that make restaurant related requests to our backend.

getAllResto:
------------

```java
export const getAllResto = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    throw new Error("Failed to fetch all restaurants");
  }
};
```

addNewResto:
------------

```java
export const addNewResto = async (body: any) => {
  try {
    const response = await axios({
      url: baseUrl,
      method: "POST",
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new restaurant:", error);
    throw new Error("Failed to add new restaurant");
  }
};
```

editResto:
----------

```java
export const editResto = async (restoName: string, body: any) => {
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
    console.error("Error editing restaurant:", error);
    throw new Error("Failed to edit restaurant");
  }
};
```

deleteResto:
------------

```java
export const deleteResto = async (restoName: string) => {
  try {
    const response = await axios({
      url: baseUrl + restoName,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw new Error("Failed to delete restaurant");
  }
};
```