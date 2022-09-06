import { max, select, selectAll } from "d3";
import createButtonContainer from "../utils/createButtonContainer";
import addAxisFactory from "../utils/addAxis";

let data: number[] = [];

export default function barChart() {
    select("main")?.append("svg").attr("width", 1200).attr("height", 800);
    setData(createRandomData());

    const button = document.createElement("button");
    const container = createButtonContainer();

    button?.addEventListener("click", () => setData(createRandomData()));
    console.log(data);
    if (button) {
        button.textContent = "Randomise";
        container?.append(button);
    }
    const addAxis = addAxisFactory(select("svg"));
    const domainX: [number, number] = [0, 1200];
    const domainY: [number, number] = [0, 800];

    addAxis(domainX, domainY);
}

function setData(newData: number[]) {
    data = newData;
    console.log(data);
    select("svg").selectAll("rect")
        .data(data)
        .join("rect")
        .transition()
        .duration(1000)
        .attr("height", (d) => d)
        .attr("width", 30)
        .attr("x", (_d, i) => 50 + i * 30 + i * 20)
        .attr("y", (d) => 800 - 20 - d);
}

function createRandomData() {
    return Array.from(new Array(10), () => {
        return Math.random() * 800;
    });
}
