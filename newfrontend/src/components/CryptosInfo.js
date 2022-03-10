import Title from "./Title";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getTopCryptos } from "../API";
import { useEffect } from "react";
import { useState } from "react";

const CryptosInfo = () => {
  return (
    <div>
      <Title>TOP Live Info</Title>
      <CryptosTable />
    </div>
  );
};

function createData(id, token, price, percentage) {
  return { id, token, price, percentage };
}
const CryptosTable = () => {
  const [rows, setrows] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const responseData = await getTopCryptos();
    console.log(responseData);
    let newRows = [];
    if (responseData) {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      let i = 0;
      for (const crypto of responseData.data) {
        console.log(crypto.symbol);
        console.log(
          crypto.metrics.market_data.percent_change_usd_last_24_hours
        );
        newRows.push(
          createData(
            i,
            crypto.symbol,
            formatter.format(crypto.metrics.market_data.price_usd),
            parseFloat(crypto.metrics.market_data.percent_change_usd_last_24_hours).toFixed(2)
          )
        );
        i++;
      }
      setrows(newRows);
    }
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 150 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell align="right">$</TableCell>
            <TableCell align="right">%</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.token}
              </TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">
                <span className={row.percentage > 0 ? "green" : "red"}>
                  {row.percentage} %
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CryptosInfo;
