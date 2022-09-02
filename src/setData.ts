import { selectAll } from "d3";

type Dot = {
    cx: number;
    cy: number;
    r: number;
};

export default function setData(data: Dot[]) {
    selectAll("circle")
        .data(data)
        .transition()
        .duration(1000)
        .attr("cx", ({ cx }) => cx+50)
        .attr("cy", ({ cy }) => cy+50)
        .attr("r", ({ r }) => r+10);
}
