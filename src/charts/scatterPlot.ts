import {
    axisBottom,
    axisLeft,
    csv,
    max,
    min,
    scaleLinear,
    select,
} from "d3";

const margin = { top: 20, right: 30, bottom: 30, left: 30 };
const width = 1200;
const height = 800;

export default async function createScatterPlot() {
    const data = await getRemoteData();
    const svg = select("main")
        .append("svg")
        .attr("width", width)
        .attr("height", height).attr('style', 'border: none');
    const scaledData = getScales(data);
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(axisLeft(getScaleY(data)));
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(axisBottom(getScaleX(data)));

    renderPlot(svg, scaledData);
}

function getScaleX(data: any[]) {
    return scaleLinear()
        .domain([min(data, getX), max(data, getX)])
        .range([margin.left, width - margin.right]);
}
function getScaleY(data: any[]) {
    return scaleLinear()
        .domain([min(data, getY), max(data, getY)])
        .range([height - margin.bottom, margin.top]);
}
function getScales(data: any[]) {
    const scaleX = getScaleX(data);
    const scaleY = getScaleY(data);
    return data.map((datum) => ({
        x: scaleX(getX(datum)),
        y: scaleY(getY(datum)),
        scaleX,
        scaleY,
    }));
}

function renderPlot(svg: any, data: any[]) {
    svg.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cy", (d: any) => d.y)
        .attr("cx", (d: any) => d.x)
        .attr("r", 5)
        .attr("fill", "black");
}

function getY(data: any) {
    return data.sepal_length;
}

function getX(data: any) {
    return data.petal_length;
}

async function getRemoteData() {
    const url =
        "https://gist.githubusercontent.com/netj/8836201/raw/6f9306ad21398ea43cba4f7d537619d0e07d5ae3/iris.csv";
    const rawData = await csv(url);
    const heads = rawData.columns.slice();

    const rows = rawData.map((row) => {
        const newRow: { [key: string]: number | string } = {};
        heads.forEach((key) => {
            if (key in row && key !== "variety") {
                newRow[key.split(".").join("_")] = parseFloat(row[key]!);
            }
        });
        return newRow;
    });

    return rows;
}
