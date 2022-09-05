import { select, selectAll } from "d3";
import createButtonContainer from "../utils/createButtonContainer";

export default function barChart() {
    select("main")?.append("svg").attr("width", 600).attr("height", 400);

    Array.from(new Array(10), () => select("svg").append("rect"));

    setData(createRandomData());
    
    const button = document.createElement('button');
    const container = createButtonContainer();

    button?.addEventListener("click", () => setData(createRandomData()));

    if (button) {
        button.textContent = "Randomise";
        container?.append(button)
    }
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
