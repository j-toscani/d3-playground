import { axisBottom, axisLeft, scaleBand, scaleLinear, select, selectAll } from "d3";

export default function barChart() {
    select("main")?.append("svg").attr("width", 600).attr("height", 400);
    select("main")?.append("button");

    Array.from(new Array(10), () => select('svg').append('rect'));

    setData(createRandomData());
    const button = document.querySelector("button");
    button?.addEventListener("click", () => setData(createRandomData()));

    if (button) {
        button.textContent = "randomise";
    }
    const scale = scaleBand().domain([0, 400]).range([20,400]).padding(20);
    const y_axis = axisLeft(scale);
    
    select('svg').append("g").call(y_axis);
}

function setData(data: number[]) {
    selectAll("rect")
        .data(data)
        .transition()
        .duration(1000)
        .attr("height", (d) => d)
        .attr("width", 30)
        .attr("x", (_d, i) => 20 + i * 30 + i * 20)
        .attr("y", (d) => 400 - d);
}

function createRandomData() {
    return Array.from(new Array(10), () => {
        return Math.random() * 400;
    });
}
