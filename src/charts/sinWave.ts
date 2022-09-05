import { range, select } from "d3";

const width = 1200;
const height = 400;

export default function createSinWave() {
    const svg = select("main")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "sin");

    const r = 15;
    const dotCount = width / (r * 2);
    let tick = 0;

    requestAnimationFrame(renderSinPlot);

    function renderSinPlot() {
        tick += 0.005;
        renderWave(createDotData(dotCount, r, tick));
        if (document.querySelector("#sin")) {
            requestAnimationFrame(renderSinPlot);
        }
    }
}

function renderWave( data: any []) {
   select("svg")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("r", ({ r }) => r)
            .attr("cx", ({ x }) => x)
            .attr("cy", ({ y }) => y)
         
    
}

function createDotData(entries: number, radius: number, tick: number) {
    return range(entries).map((d) => ({
        x: d * (radius + radius) + radius,
        y:
            radius +
            (height - radius * 2) / 2 +
            (Math.sin(d * 0.2 + tick) * (height - radius * 2)) / 2,
        r: radius,
    }));
}
