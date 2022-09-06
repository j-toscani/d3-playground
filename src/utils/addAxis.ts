import { select, min, max, axisLeft, axisBottom, scaleLinear } from "d3";

type Mark = {
    x: number;
    y: number;
};

const defaultWidth = 1200; // SVG size
const defaultHeight = 800;

const defaultMargin = {
    bottom: 20,
    top: 20,
    right: 30,
    left: 30,
}; // setup for margin convention

export default function addAxis(
    data: Mark[],
    dimensions: {
        width?: number;
        height?: number;
        margin?: { bottom: number; top: number; left: number; right: number };
    } = {}
) {
    const {
        width = defaultWidth,
        height = defaultHeight,
        margin = defaultMargin,
    } = dimensions;

    // we assume main is the container for the SVG;
    const svg = select("svg");

    const scaleX = scaleLinear()
        .domain([min(data, getX) ?? 0, max(data, getX) ?? 0])
        .range([margin.left, width - margin.right]);

    // height has to be swapped because `y === 0` is at the top of the SVG
    const scaleY = scaleLinear()
        .domain([min(data, getY) ?? 0, max(data, getY) ?? 0])
        .range([height - margin.top, margin.bottom]);

    const axisY = svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(axisLeft(scaleY));
    const axisX = svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(axisBottom(scaleX));
}
function getY(data: Mark) {
    return data.y;
}

function getX(data: Mark) {
    return data.x;
}
