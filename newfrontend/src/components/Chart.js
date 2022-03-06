import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import { getChartData } from "../API";
import { useState } from "react";
import { useEffect } from "react";

// Generate Sales Data
function createData(date, amount) {
  return { date, amount };
}

export default function Chart() {
  const theme = useTheme();
  const [data, setdata] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const responseData = await getChartData();
    let returnData = [];
    console.log(responseData);
    if (responseData) {
      for (const element of responseData) {
        if (element) {
          console.log(element.date);
          returnData.push(createData(element.parsedDate, element.usdValue));
        }
      }
    }
    returnData=returnData.reverse();
    console.log(returnData);
    setdata(returnData);
  }

  return (
    <React.Fragment>
      <Title>Balance Evolution</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            bottom: 0,
            left: 25,
          }}
        >
          <XAxis
            dataKey="date"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              USD ($)
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
