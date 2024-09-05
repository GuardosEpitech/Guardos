import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/`;

export const checkIfTokenIsValid = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'login/restoWeb/checkIn',
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
  }
};

export const checkIfRestoUserExist = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'user/userRestoExist',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking resto user:", error);
  }
};

export const sendRecoveryLinkForRestoUser = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'sendEmail/userResto/sendPasswordRecovery',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
  }
};

export const updateRestoPassword = async (token: string, 
  newPassword: string) => {
  try {
    const response = await axios({
      method: "PUT",
      url: baseUrl + 'profile/resto/updateRecoveryPassword',
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
  }
};

export const addRestoChain = async (token: string, 
  restoChainName: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'profile/resto/restoChain',
      params: {key: token},
      data: {
        restoChainName: restoChainName
      },
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
  }
}

export const deleteRestoChain = async (token: string, 
  restoChainName: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'profile/resto/restoChain',
      params: {key: token},
      data: {
        restoChainName: restoChainName
      },
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
  }
}

export const deleteRestoAccount = async (token: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'delete/resto',
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
  }
};

export const addCustomer = async (token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'payments/addCustomerResto',
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
  }
};

export const getCustomer = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'payments/getCustomerResto',
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
  }
};

export const getPaymentMethods = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'payments/showPaymentMethodsResto',
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
    }
  } catch (error) {
    console.error("Error deleting payment method:", error);
  }
};

export const verfyTwoFactorAndLogin =
    async (userId: number, code: string, user: any) => {
      try {
        return await axios({
          method: 'POST',
          url: baseUrl + 'login/restoWeb/TwoFactor',
          data: JSON.stringify({
            id: userId,
            code: code,
            username: user.username,
            password: user.password
          }),
          headers: {
            "content-type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error verifying two factor code:", error);
        return error;
      }
    };

export const createSubscription = async (token: string, priceId: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'payments/create-subscription-resto',
      data: JSON.stringify({
        priceId: priceId,
      }),
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
  }
};

export const getSubscriptionTime = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'payments/subscribedTime-resto',
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
  }
};

export const getSubscriptionID = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'payments/get-subscription-resto',
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
  }
};

export const deleteSubscription = async (token: string, subscriptionId: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'payments/delete-subscription-resto',
      params: {key: token},
      data: JSON.stringify({
        subscriptionId: subscriptionId,
      }),
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
  }
};

export const deleteSubscriptionTime = async (token: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'payments/subscribedTime-resto',
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
  }
};

export const deleteActiveSubscription = async (token: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'payments/activeSubscription-resto',
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
  }
};

export const addActiveSubscription = async (token: string, activeSubscriptionIdentifier: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'payments/activeSubscription-resto',
      data: JSON.stringify({
        activeSubscriptionIdentifier: activeSubscriptionIdentifier,
      }),
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
  }
};

export const getActiveSubscription = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'payments/activeSubscription-resto',
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
  }
};

export const addSubscriptionTime = async (token: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'payments/subscribedTime-resto',
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
  }
};