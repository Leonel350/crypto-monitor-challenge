import commonMiddleware from "../lib/commonMiddleware";
import generateResponse from "../lib/generateResponse";
import {
  calculateDayValue,
  getAnyDayData,
  getTodayData,
  getYesterdayData,
} from "../lib/getTodayData";
import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTodayCryptos(event, context) {
  let data = await getTodayData();
  if (!data.hasOwnProperty("usdValue")) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    data = getAnyDayData(now.toISOString());
  }
  data.cryptos = JSON.parse(data.cryptos);
  return generateResponse(200, { data });
}

async function getChartData(event, context) {
  let daysArr = [];
  let todayData = await getTodayData();
  if (todayData) todayData.cryptos = JSON.parse(todayData.cryptos);
  if (todayData)
  todayData.parsedDate = `${new Date(todayData.date).getDate()}/${
    new Date(todayData.date).getMonth() + 1
  }/${new Date(todayData.date).getFullYear()}`;
  daysArr.push(todayData);
  for (let index = 1; index < 7; index++) {
    let date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * index);
    date.setHours(0, 0, 0, 0);
    let data = await getAnyDayData(date.toISOString());
    if (data) data.cryptos = JSON.parse(data.cryptos);
    if (data)
      data.parsedDate = `${new Date(data.date).getDate()}/${
        new Date(data.date).getMonth() + 1
      }/${new Date(data.date).getFullYear()}`;
    daysArr.push(data);
  }

  return generateResponse(200, daysArr);
}

async function dailyRun(event, context) {
  let todayData = await getTodayData();
  let yesterdayData = await getYesterdayData();
  const totalValue = await calculateDayValue(yesterdayData);
  let updatedYesterday;
  try {
    const result = await dynamodb
      .update({
        TableName: process.env.CRYPTOS_TABLE_NAME,
        Key: { _id: yesterdayData._id },
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

  console.log("Daily Success.");
  console.log("Today is: " + JSON.stringify(todayData));
  console.log("Yesterday price updated: " + JSON.stringify(updatedYesterday));
}

export const handler = commonMiddleware(getTodayCryptos);
export const chartData = commonMiddleware(getChartData);
export const daily = commonMiddleware(dailyRun);
