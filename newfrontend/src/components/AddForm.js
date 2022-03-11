import { Button } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { addCrypto, getCryptoNAME, getCryptoUSD } from "../API";
import Title from "./Title";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { TextField } from "@mui/material";
import { LinearProgress } from "@mui/material";
import { CircularProgress } from "@mui/material";
export default function AddForm() {
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [validToken, setvalidToken] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [sending, setsending] = useState(false);

  async function sendData() {
    if (validToken) {
      setsending(true);
      console.log(token, amount);
      await addCrypto(token, amount, price);
      setsending(false);
      window.location = "/";
    }
  }
  async function searchToken(token) {
    setvalidToken("loading");
    try {
      const result = await getCryptoNAME(token);
      console.log(result);
      if (!result) {
        setvalidToken("invalid");
      } else {
        console.log(result);
        setvalidToken("valid");
        setTokenName(result);
        setToken(token.toUpperCase());
      }
    } catch (error) {
      console.log("nope");
      setvalidToken("invalid");
    }
  }

  async function autoPrice() {
    if (validToken) {
      const result = await getCryptoUSD(token);
      setPrice(parseFloat(result).toFixed(2));
    }
  }

  function TokenValider() {
    if (validToken === "loading") {
      return <LinearProgress style={{ height: "25px", width: "70px" }} />;
    } else if (validToken === "valid") {
      return (
        <div>
          <CheckIcon></CheckIcon> {tokenName}
        </div>
      );
    } else if (validToken === "invalid") {
      return (
        <div>
          <ErrorOutlineIcon></ErrorOutlineIcon> This Token is not recognised by
          the plarform
        </div>
      );
    } else {
      return <div>Enter a valid Token</div>;
    }
  }

  return (
    <div>
      <Title>Inform New Purchase</Title>
      <div>
        <TextField
          label="Token"
          onChange={(e) => searchToken(e.target.value)}
        ></TextField>
      </div>
      <TokenValider></TokenValider>
      <div>
        <br />
        <TextField
          type="number"
          label="Amount"
          onChange={(e) => setAmount(e.target.value)}
        ></TextField>
      </div>
      <br />
      <div>
        <TextField
          label="Price"
          helperText="The price you bought the token"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        ></TextField>{" "}
        <Button
          onClick={(e) => {
            autoPrice();
          }}
        >
          {" "}
          Auto Price
        </Button>
      </div>
      <br />
      <Button
        variant="outlined"
        onClick={(e) => {
          sendData();
        }}
      >
        {sending ? <CircularProgress size={25} /> : "Send"}
      </Button>
    </div>
  );
}
