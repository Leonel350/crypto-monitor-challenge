import { Button } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import {
  addCrypto,
  getCryptoNAME,
  getCryptoUSD,
  getTodayData,
  sellCrypto,
} from "../API";
import Title from "./Title";
import CheckIcon from "@mui/icons-material/Check";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { TextField } from "@mui/material";
import { LinearProgress } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
export default function ConversionForm() {
  const [token, setToken] = useState("");
  const [token2, setToken2] = useState("");
  const [amount, setAmount] = useState("");
  const [validToken, setvalidToken] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [validToken2, setvalidToken2] = useState("");
  const [token2Name, setToken2Name] = useState("");
  const [sending, setsending] = useState(false);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchToken(token);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [token, amount]);
  async function sendData() {
    if (validToken === "valid" && validToken2 === "valid") {
      setsending(true);
      console.log(token, token2, amount);
      let avaliableUsd = await getCryptoUSD(token);
      avaliableUsd *= amount;
      await sellCrypto(token, amount);
      let usd2Token = await getCryptoUSD(token2);
      const newAmount = avaliableUsd / usd2Token;
      await addCrypto(token2, newAmount, usd2Token);
      setsending(false);
      window.location = "/";
    }
  }
  async function searchToken2(token) {
    setvalidToken2("loading");
    try {
      const result = await getCryptoNAME(token);
      console.log(result);
      setvalidToken2("valid");
      setToken2Name(result);
      setToken2(token.toUpperCase());
    } catch (error) {
      console.log("nope");
      setvalidToken2("invalid");
    }
  }

  async function searchToken(token) {
    setvalidToken("loading");
    try {
      const result = await getTodayData(token);
      console.log(result);
      let found = false;
      let validAmount = false;
      let ite = 0;
      console.log(result.data.cryptos);
      while (!found && ite < result.data.cryptos.length) {
        if (result.data.cryptos[ite].token === token.toUpperCase()) {
          found = true;
          if (result.data.cryptos[ite].amount >= amount) {
            validAmount = true;
          }
        }
        ite++;
      }
      console.log(found);
      if (found && validAmount) {
        setvalidToken("valid");
        setToken(token.toUpperCase());
      } else if (found) {
        setvalidToken("validNoAmount");
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
          <CheckIcon></CheckIcon> You Own this Token
        </div>
      );
    } else if (validToken === "invalid") {
      return (
        <div>
          <ErrorOutlineIcon></ErrorOutlineIcon> You don't own this token
        </div>
      );
    } else if (validToken === "validNoAmount") {
      return (
        <div>
          <ErrorOutlineIcon></ErrorOutlineIcon> You don't have enough of this
          crypto
        </div>
      );
    } else {
      return <div>Enter a valid Token</div>;
    }
  }

  function Token2Valider() {
    if (validToken2 === "loading") {
      return <LinearProgress style={{ height: "25px", width: "70px" }} />;
    } else if (validToken2 === "valid") {
      return (
        <div>
          <CheckIcon></CheckIcon> {token2Name}
        </div>
      );
    } else if (validToken2 === "invalid") {
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
      <Title>Magic Conversion</Title>
      <p>This form will automaticly convert one crypto to another</p>
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
      <div>
        <TextField
          label="Convert to"
          onChange={(e) => searchToken2(e.target.value)}
        ></TextField>
        <Token2Valider></Token2Valider>
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
