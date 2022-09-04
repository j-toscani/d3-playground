import { select, selectAll } from "d3";

export default function createDotPlot() {
    select("main").append("svg").attr("height", 400).attr("width", 600);
    select("main").append("button");

    const dots = 40;

    for (let index = 0; index < dots; index++) {
        select("svg").append("circle");
    }

    const button = document.querySelector("button");

    if (button) {
        button.textContent = "randomise";
        button.addEventListener("click", () =>
            setPlotData(createPlotData(dots))
        );
    }
    setPlotData(createPlotData(dots));
}

function createPlotData(dots: number) {
    return Array.from(new Array(dots), () =>
        Math.floor(Math.random() * 390 + 5)
    );
}

function setPlotData(data: number[]) {
    selectAll("circle")
        .data(data.sort((a, b) => b - a))
        .transition()
        .duration(750)
        .attr("cy", (d) => d)
        .attr("cx", (_d, i) => 4 + i * 15)
        .attr("r", 5);
}
