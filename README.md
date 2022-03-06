# Crypto Monitor

## The Challenge

The challenge was to create a digital solution that allows the user to keep track of the purcharses of cryptos, and to be able to see how much money was made or lost for each operation.

## Deployment

I decided to develop a full Node+React app.
I used Serverless Framework with AWS.

The system does not use autentification and does not allow multiple users. This feature could be added.
The system stores the information of the cryptos for each day starting the day the first request is made to the backend. This information includes the value in dollars for that day at the end of the day.
The user will be able to see it's current balance in dollars, the balance for each crypto and the value in dollars at the moment of the request.
The system stores the "app" (Avarage Purcharse Price) of each crypto each day. With this information the application can calculate the difference between this price and the actual price.

In the frontend the user can see a chart made using the value of the cryptos made at the end of each day.
The user can add a crypto, which will be validated. The user can remove cryptos from the databse too.

## The Stack

### Technology

- https://www.serverless.com/
- https://reactjs.org/

### Data

- https://data.messari.io
- https://coinmarketcap.com/
