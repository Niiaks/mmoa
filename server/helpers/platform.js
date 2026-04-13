import axios from "axios";
import { detectNetwork } from "./detectNetwork.js";

import "dotenv/config";

const code = detectNetwork("+233597090312");

//dummy platform recipient
async function createPlatformRecipient() {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "mobile_money",
        name: "Nii Akwei Pappoe",
        account_number: "0597090312",
        bank_code: code,
        description: "platform fees collection account",
        currency: "GHS",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

createPlatformRecipient();
