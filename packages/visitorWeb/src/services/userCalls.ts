import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/`;

export const checkIfVisitorTokenIsValid = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'login/checkIn',
      params: body,
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching the Users:", error);
    throw new Error("Error fetching the Users");
  }
};

export const checkIfVisitorUserExist = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'user/userVisitorExist',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
    throw new Error("Error checking visitor user");
  }
};

export const sendRecoveryLinkForVisitorUser = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'sendEmail/userVisitor/sendPasswordRecovery',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
    throw new Error("Error checking visitor user");
  }
}

export const updateVisitorPassword = async (token: string, 
  newPassword: string) => {
  try {
    const response = await axios({
      method: "PUT",
      url: baseUrl + 'profile/updateRecoveryPassword',
      params: {key: token},
      data: {
        newPassword: newPassword
      },
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
    throw new Error("Error checking visitor user");
  }
}

export const deleteAccount = async (token: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'delete/',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error deleting the User:", error);
    throw new Error("Error deleting the User");
  }
};

export const getUserAllergens = async (token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'user/allergens/get',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching the User allergens:", error);
    throw new Error("Error fetching the User allergens");
  }
};

export const addCustomer = async (token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'payments/addCustomerVisitor',
      data: {
        userToken: token
      },
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Unexpected status code:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error adding Customer:", error);
    throw new Error("Error adding Customer");
  }
};

export const getCustomer = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'payments/getCustomerVisitor',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching Customer:", error);
    throw new Error("Error fetching Customer");
  }
};

export const getPaymentMethods = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'payments/showPaymentMethodsVisitor',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw new Error("Error fetching payment methods");
  }
};

export const deletePaymentMethod = async (paymentID: string) => {
  try {
    const response = await axios({
      method: 'POST',
      url: baseUrl + 'payments/deletePaymentMethod',
      data: JSON.stringify({
        paymentID: paymentID,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return true;
    } else {
      console.error("Unexpected status code:", response.status);
      throw new Error("Unexpected status code");
    }
  } catch (error) {
    console.error("Error deleting payment method:", error);
    throw new Error("Error deleting payment method");
  }
};