import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();
import { v4 as uuid } from "uuid";
import axios from "axios";

export async function getTodayData() {
  console.log("traigo info de hoy");
  let todayData;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const today = now.toISOString();
  console.log("el nombre de la tabla es: " + process.env.CRYPTOS_TABLE_NAME);
  console.log("hoy es " + today);
  try {
    const results = await dynamodb
      .query({
        TableName: process.env.CRYPTOS_TABLE_NAME,
        IndexName: "date",
        KeyConditionExpression: "#date = :date",
        ExpressionAttributeValues: {
          ":date": today,
        },
        ExpressionAttributeNames: {
          "#date": "date",
        },
      })
      .promise();
    todayData = results.Items;
  } catch (error) {
    console.error(error);
  }
  console.log("se trajo: " + JSON.stringify(todayData));
  if (Array.isArray(todayData) && todayData.length) {
    return todayData[0];
  } else {
    console.log("intento traer datos de ayer");
    const yesterday = await getYesterdayData();
    console.log("los datos de ayer son:" + yesterday);
    let newData;
    if (!yesterday) {
      newData = {
        _id: uuid(),
        date: today,
        cryptos: JSON.stringify([]),
      };
    } else {
      console.log("instancio hoy con datos de ayer");
      newData = {
        _id: uuid(),
        date: today,
        cryptos: yesterday.cryptos,
      };
    }
    try {
      await dynamodb
        .put({
          TableName: process.env.CRYPTOS_TABLE_NAME,
          Item: newData,
        })
        .promise();
    } catch (error) {
      console.error(error);
    }
    return newData;
  }
}

export async function updateTodayUSDValue() {
  const todayData = await getTodayData();
  const totalValue = await calculateDayValue(todayData);
  let updatedDay;
  try {
    const result = await dynamodb
      .update({
        TableName: process.env.CRYPTOS_TABLE_NAME,
        Key: { _id: todayData._id },
        UpdateExpression: "set #usdValue = :usdValue",
        ExpressionAttributeValues: {
          ":usdValue": totalValue,
        },
        ExpressionAttributeNames: {
          "#usdValue": "usdValue",
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
    updatedDay = result.Attributes;
  } catch (error) {
    console.error(error);
    return null;
  }
  return updatedDay;
}

export async function getYesterdayData() {
  let yesterdayData;
  const now = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  now.setHours(0, 0, 0, 0);
  const yesterday = now.toISOString();
  try {
    const results = await dynamodb
      .query({
        TableName: process.env.CRYPTOS_TABLE_NAME,
        IndexName: "date",
        KeyConditionExpression: "#date = :date",
        ExpressionAttributeValues: {
          ":date": yesterday,
        },
        ExpressionAttributeNames: {
          "#date": "date",
        },
      })
      .promise();
    yesterdayData = results.Items;
  } catch (error) {
    console.error(error);
  }

  if (Array.isArray(yesterdayData) && yesterdayData.length) {
    if (!yesterdayData[0].hasOwnProperty("usdValue")) {
      const totalValue = await calculateDayValue(yesterdayData[0]);
      let updatedYesterday;
      try {
        const result = await dynamodb
          .update({
            TableName: process.env.CRYPTOS_TABLE_NAME,
            Key: { _id: yesterdayData[0]._id },
            UpdateExpression: "set #usdValue = :usdValue",
            ExpressionAttributeValues: {
              ":usdValue": totalValue,
            },
            ExpressionAttributeNames: {
              "#usdValue": "usdValue",
            },
            ReturnValues: "ALL_NEW",
          })
          .promise();
        updatedYesterday = result.Attributes;
      } catch (error) {
        console.error(error);
      }
      return updatedYesterday;
    }
    return yesterdayData[0];
  }
  return null;
}

export async function getAnyDayData(day) {
  console.log("dia recibido:" + day);
  let dayData;
  try {
    const results = await dynamodb
      .query({
        TableName: process.env.CRYPTOS_TABLE_NAME,
        IndexName: "date",
        KeyConditionExpression: "#date = :date",
        ExpressionAttributeValues: {
          ":date": day,
        },
        ExpressionAttributeNames: {
          "#date": "date",
        },
      })
      .promise();
    dayData = results.Items;
  } catch (error) {
    console.error(error);
  }
  console.log(JSON.stringify(dayData));

  if (Array.isArray(dayData) && dayData.length) {
    if (!dayData[0].hasOwnProperty("usdValue")) {
      console.log("no tiene la propiedad");
      console.log(dayData);
      const totalValue = await calculateDayValue(dayData[0]);
      let updatedDay;
      try {
        const result = await dynamodb
          .update({
            TableName: process.env.CRYPTOS_TABLE_NAME,
            Key: { _id: dayData[0]._id },
            UpdateExpression: "set #usdValue = :usdValue",
            ExpressionAttributeValues: {
              ":usdValue": totalValue,
            },
            ExpressionAttributeNames: {
              "#usdValue": "usdValue",
            },
            ReturnValues: "ALL_NEW",
          })
          .promise();
        updatedDay = result.Attributes;
      } catch (error) {
        console.error(error);
      }
      return updatedDay;
    }
    return dayData[0];
  }
  return null;
}
export async function calculateDayValue(day) {
  let totalValue = 0;
  const cryptos = JSON.parse(day.cryptos);
  for (const element of cryptos) {
    console.log("evaluando para " + element.token);
    let usdValue = await getActualUSDPrice(element.token, element.amount);
    console.log("su valor es: " + usdValue);
    totalValue += usdValue;
  }
  return totalValue;
}

async function getActualUSDPrice(symbol, amount) {
  let price;
  try {
    const url = "https://pro-api.coinmarketcap.com/v2/tools/price-conversion";
    const options = {
      params: {
        symbol: symbol,
        amount: amount,
        convert: "USD",
      },
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-CMC_PRO_API_KEY": "f9cb6139-40c8-4094-8307-64d78aa66cab",
      },
    };
    const response = await axios.get(url, options);
    console.log(response.data);
    price = response.data.data[0].quote.USD.price;
    console.log(`Resultado ${price}`);
  } catch (error) {
    console.error(JSON.stringify(error));
    throw new Error(error);
  }
  return price;
}
