import AWS from "aws-sdk";
import commonMiddleware from "../lib/commonMiddleware";
import generateResponse from "../lib/generateResponse";
import { getTodayData, updateTodayUSDValue } from "../lib/getTodayData";
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function addCrypto(event, context) {
  const { token, amount, price } = event.body;
  const data = await getTodayData();
  console.log("data es :" + JSON.stringify(data));
  let newCryptos = JSON.parse(data.cryptos);
  console.log(newCryptos);
  const arrPos = newCryptos
    .map(function (e) {
      return e.token;
    })
    .indexOf(token);
  console.log(arrPos);
  if (arrPos != -1) {
    newCryptos[arrPos].ppc =
      (newCryptos[arrPos].ppc * newCryptos[arrPos].amount + price * amount) /
      (newCryptos[arrPos].amount + amount);
    newCryptos[arrPos].amount += amount;
  } else {
    const newToken = {
      token: token,
      amount: amount,
      ppc: price,
    };
    newCryptos.push(newToken);
  }
  try {
    await dynamodb
      .update({
        TableName: process.env.CRYPTOS_TABLE_NAME,
        Key: { _id: data._id },
        UpdateExpression: "set #cryptos = :cryptos",
        ExpressionAttributeValues: {
          ":cryptos": JSON.stringify(newCryptos),
        },
        ExpressionAttributeNames: {
          "#cryptos": "cryptos",
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  } catch (error) {
    console.error(error);
  }
  const updatedData = await updateTodayUSDValue();
  console.log("updated es:" + JSON.stringify(updatedData));
  return generateResponse(200, updatedData);
}

async function sellCrypto(event, context) {
  const { token, amount } = event.body;
  const data = await getTodayData();
  console.log("data es :" + JSON.stringify(data));
  let newCryptos = JSON.parse(data.cryptos);
  console.log(newCryptos);
  const arrPos = newCryptos
    .map(function (e) {
      return e.token;
    })
    .indexOf(token);
  console.log(arrPos);
  if (arrPos != -1) {
    if (amount > newCryptos[arrPos].amount) {
      return generateResponse(
        400,
        "There are no enough existences of the token"
      );
    }
    newCryptos[arrPos].amount -= amount;
    if (newCryptos[arrPos].amount == 0) {
      newCryptos.splice(arrPos, 1);
    }
  } else {
    return generateResponse(400, "There are no existences of the token");
  }
  try {
    await dynamodb
      .update({
        TableName: process.env.CRYPTOS_TABLE_NAME,
        Key: { _id: data._id },
        UpdateExpression: "set #cryptos = :cryptos",
        ExpressionAttributeValues: {
          ":cryptos": JSON.stringify(newCryptos),
        },
        ExpressionAttributeNames: {
          "#cryptos": "cryptos",
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
  } catch (error) {
    console.error(error);
  }
  const updatedData = await updateTodayUSDValue();
  console.log("updated es:" + JSON.stringify(updatedData));
  return generateResponse(200, updatedData);
}

export const handler = commonMiddleware(addCrypto);
export const sellHandler = commonMiddleware(sellCrypto);
