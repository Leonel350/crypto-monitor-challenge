const axios = require("axios").default;
export async function getChartData() {
  const url =
    "https://jjqgkzuh82.execute-api.eu-central-1.amazonaws.com/dev/cryptos/chart";
  const response = await axios.get(url);
  return response.data;
}

export async function getTodayData() {
  const url =
    "https://jjqgkzuh82.execute-api.eu-central-1.amazonaws.com/dev/cryptos";
  const response = await axios.get(url);
  return response.data;
}

export async function getCryptoUSD(token) {
  const url = `https://data.messari.io/api/v1/assets/${token}/metrics`;
  const response = await axios.get(url);
  console.log(response);
  return response.data.data.market_data.price_usd;
}

export async function getCryptoNAME(token) {
  const url = `https://data.messari.io/api/v1/assets/${token}/metrics`;
  const response = await axios.get(url);
  console.log(response);
  if(response.data.data.market_data.price_usd){
    return response.data.data.name;
  }
  return null;
}

export async function addCrypto(token, amount, price) {
  const url = `https://jjqgkzuh82.execute-api.eu-central-1.amazonaws.com/dev/cryptos`;
  const response = await axios.post(url, { token, amount, price });
  console.log(response);
  return response.data;
}

export async function sellCrypto(token, amount) {
  const url = `https://jjqgkzuh82.execute-api.eu-central-1.amazonaws.com/dev/cryptos`;
  const response = await axios.patch(url, { token, amount });
  console.log(response);
  return response.data;
}

export async function getTopCryptos() {
  const url = `https://data.messari.io/api/v2/assets?limit=9`;
  const response = await axios.get(url, {});
  console.log(response);
  return response.data;
}
