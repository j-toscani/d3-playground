import { min } from "d3-array";
import { csv } from "d3-fetch";
import { select } from "d3-selection";
import Scatterplot from "../charts/ScatterPlot";

export default async function buildScatterPlot() {
  const data = await getRemoteData();

  const chart = new Scatterplot(data, {
    width: 1200,
    height: 600,
    margin: { top: 20, left: 30, right: 30, bottom: 20 },
    getters: {
      x: (d) => d.petal_length,
      y: (d) => d.sepal_length,
      r: () => 5,
    },
  });

  chart.domain.y = [min(chart.data, chart.getters.y)!, chart.domain.y[1]];
  chart.domain.x = [min(chart.data, chart.getters.x)!, chart.domain.x[1]];

  chart.render(select("main").append("svg"))
}

async function getRemoteData() {
  const url =
    "https://gist.githubusercontent.com/netj/8836201/raw/6f9306ad21398ea43cba4f7d537619d0e07d5ae3/iris.csv";
  const rawData = await csv(url);
  const heads = rawData.columns.slice();

  const rows = rawData.map((row) => {
    const newRow: { [key: string]: number } = {};
    heads.forEach((key) => {
      if (key in row && key !== "variety") {
        newRow[key.split(".").join("_")] = parseFloat(row[key]!);
      }
    });
    return newRow;
  });

  return rows;
}
