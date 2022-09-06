import { select, selectAll } from "d3";
import createButtonContainer from "../utils/createButtonContainer";
import addAxis from "../utils/addAxis";

let data: number[] = [];

export default function barChart() {
    select("main")?.append("svg").attr("width", 1200).attr("height",800);
    setData(createRandomData());
    Array.from(new Array(10), () => select("svg").append("rect"));
    
    const button = document.createElement('button');
    const container = createButtonContainer();

    button?.addEventListener("click", () => setData(createRandomData()));

    if (button) {
        button.textContent = "Randomise";
        container?.append(button)
    }

    addAxis(data.map(data => ({x:data, y:data})));
}

function setData(newData: number[]) {
    data = newData;
    selectAll("rect")
        .data(data)
        .transition()
        .duration(1000)
        .attr("height", (d) => d)
        .attr("width", 30)
        .attr("x", (_d, i) => 50 + i * 30 + i * 20)
        .attr("y", (d) => 800-20 - d);
}

function createRandomData() {
    return Array.from(new Array(10), () => {
        return Math.random() * 800 - 20;
    });
}
