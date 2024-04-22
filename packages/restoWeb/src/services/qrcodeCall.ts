import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/qrcode`;

export const addQRCode = async (body: any) => {
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

export const getQRCodeByNameBase64 = async (name: string) => {
  try {
    const response = await axios({
      url: `${baseUrl}/base64/${name}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching QR code by name:", error);
    throw new Error("Failed to fetch QR code by name");
  }
};

export const getQRCodeByName = async (name: string) => {
  try {
    const response = await axios({
      url: `${baseUrl}/${name}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching QR code by name:", error);
    throw new Error("Failed to fetch QR code by name");
  }
};
