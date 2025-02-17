import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/qrcode`;

export const addQRCode = async (body: any) => {
    console.log(body);
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

export const getQRCodeByNameBase64 = async (uid: number) => {
    console.log("this is the uid", uid);
    try {
        const response = await axios({
            url: `${baseUrl}/base64/${uid}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching QR code by uid:", error);
        throw new Error("Failed to fetch QR code by uid");
    }
};

export const getQRCodeByName = async (uid: number) => {
    try {
        const response = await axios({
            url: `${baseUrl}/${uid}`,
            method: "GET",
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching QR code by uid:", error);
        throw new Error("Failed to fetch QR code by uid");
    }
};