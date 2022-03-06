import * as React from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { useEffect } from "react";
import { getTodayData } from "../API";
import { useState } from "react";

export default function TotalBalance() {
  const [balance, setbalance] = useState("Loading");
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const responseData = await getTodayData();
    console.log(responseData);
    if (responseData) {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      setbalance(formatter.format(responseData.data.usdValue));
    }
  }
  return (
    <React.Fragment>
      <Title>Total Balance</Title>
      <Typography component="p" variant="h4">
        USD {balance}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {new Date().toDateString()}
      </Typography>
      {/* <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div> */}
    </React.Fragment>
  );
}
