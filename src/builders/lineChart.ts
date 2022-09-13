import { select } from "d3";
import createButtonContainer from "../utils/createButtonContainer";

export default function createLineChart() {
    select("main").append("svg").append('path');

    select("svg").attr("width", 600).attr('height', 400);
    
    const container = createButtonContainer();
    const button = document.createElement("button");
    const points = 12;

    if (button) {
        button.textContent = "Randomise";
        button.addEventListener("click", () =>
            setLineData(createLineData(points))
        );
        container?.append(button);
    }

    setLineData(createLineData(points));
}

function createLineData(points: number) {
    return Array.from(new Array(points), (_e, i) => {
        return { y: Math.floor(Math.random() * 400), x: i * 50 };
    });
}

function setLineData(points: { x: number; y: number }[]) {
    const path = `M 0 ${400 - points[0].y}, ${points
        .slice(1)
        .map(({ x, y }) => 
            `L ${x} ${400 - y}`
        )
        .join(", ")}`;

    select("path")
        .data(points).transition().duration(750)
        .attr("d", path)
        .attr("stroke", "black")
        .attr("fill", "transparent")
        .attr("stroke-width", 4);
}
