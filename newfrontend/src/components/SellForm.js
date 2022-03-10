import { Button } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { getTodayData, sellCrypto } from "../API";
import Title from "./Title";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { TextField } from "@mui/material";
import { LinearProgress } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

export default function SellForm() {
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [validToken, setvalidToken] = useState("");
  const [sending, setsending] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchToken(token);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [token]);

  async function sendData() {
    if (validToken === "valid") {
      setsending(true);
      console.log(token, amount);
      try {
        await sellCrypto(token, amount);
        window.location = "/";
      } catch (error) {
        console.log(error);
      }
      setsending(false);
    }
  }
  async function searchToken(token) {
    setvalidToken("loading");
    try {
      const result = await getTodayData(token);
      console.log(result);
      let found = false;
      let ite = 0;
      console.log(result.data.cryptos);
      while (!found && ite < result.data.cryptos.length) {
        if (result.data.cryptos[ite].token === token.toUpperCase()) {
          found = true;
        }
        ite++;
      }
      console.log(found);
      if (found) {
        setvalidToken("valid");
        setToken(token.toUpperCase());
      } else {
        setvalidToken("invalid");
      }
    } catch (error) {
      console.log(error);
      setvalidToken("invalid");
    }
  }

  function TokenValider() {
    if (validToken === "loading") {
      return <LinearProgress style={{ height: "25px", width: "70px" }} />;
    } else if (validToken === "valid") {
      return (
        <div>
          <CheckIcon></CheckIcon> You have this crypto
        </div>
      );
    } else if (validToken === "invalid") {
      return (
        <div>
          <ErrorOutlineIcon></ErrorOutlineIcon> You don't own this crypto
        </div>
      );
    } else {
      return <div>Enter a valid Token</div>;
    }
  }

  return (
    <div>
      <Title>Inform New Sell / Remove Tokens</Title>
      <div>
        <TextField
          label="Token"
          onChange={(e) => setToken(e.target.value)}
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
