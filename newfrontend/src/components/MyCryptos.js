import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { getCryptoUSD, getTodayData } from "../API";
import { useState } from "react";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
// Generate Order Data
function createData(id, token, amount, price, value, ppm, percentage) {
  amount = amount.toFixed(2);
  return { id, token, amount, price, value, ppm, percentage };
}

export default function MyCryptos() {
  const [rows, setrows] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const responseData = await getTodayData();
    console.log(responseData);
    let newRows = [];
    if (responseData) {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      let i = 0;
      for (const crypto of responseData.data.cryptos) {
        const usdValue = await getCryptoUSD(crypto.token);
        let percentage = (
          (parseFloat(usdValue).toFixed(2) * 100) / parseFloat(crypto.ppc).toFixed(3) -
          100
        ).toFixed(2);
        newRows.push(
          createData(
            i,
            crypto.token,
            crypto.amount,
            formatter.format(usdValue),
            formatter.format(usdValue * crypto.amount),
            formatter.format(crypto.ppc),
            percentage
          )
        );
        i++;
      }
      setrows(newRows);
    }
  }

  return (
    <React.Fragment>
      <Title>My Cryptos</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Total USD </TableCell>
            <TableCell>USD Per Action</TableCell>
            <TableCell>APP</TableCell>
            <TableCell align="right">%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 && <CircularProgress></CircularProgress>}
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.token}</TableCell>
              <TableCell>{`${row.amount}`}</TableCell>
              <TableCell>{`${row.value}`}</TableCell>
              <TableCell>{`${row.price}`}</TableCell>
              <TableCell>{`${row.ppm}`}</TableCell>
              <TableCell align="right">{`${row.percentage} %`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
