import axios from "axios";

async function getGhanaBanks() {
  try {
    const response = await axios.get(
      "https://api.paystack.co/bank?country=ghana&type=mobile_money",
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

getGhanaBanks();
