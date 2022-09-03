import { selectAll } from "d3";
import { select } from "d3";

const createDataSet = () => Array.from(new Array(4), createRandomDotFactory());

export default function randomDots() {
    select("main").append("svg");
    select("main").append("button");

    const button = document.querySelector("button");
    button!.textContent = "Randomise";

    select("svg").attr("width", 600).attr("height", 400);

    [1, 2, 3, 4].forEach(() => {
        select("svg").append("circle");
    });

    button?.addEventListener("click", () => {
        setData(createDataSet());
    });

    setData(createDataSet());
}

function createRandomDotFactory(width = 600, height = 400, radius = 50) {
    return () => {
        return {
            cy: Math.floor(Math.random() * (height - radius * 2)) + radius,
            cx: Math.floor(Math.random() * (width - radius * 2)) + radius,
            r:
                Math.floor(Math.random() * (radius - radius * 0.2)) +
                radius * 0.2,
        };
    };
}

type Dot = {
    cx: number;
    cy: number;
    r: number;
};

function setData(data: Dot[]) {
    selectAll("circle")
        .data(data)
        .transition()
        .duration(1000)
        .attr("cx", ({ cx }) => cx)
        .attr("cy", ({ cy }) => cy)
        .attr("r", ({ r }) => r);
}
