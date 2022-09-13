import { easeLinear, select } from "d3";
import { Mark } from "./weatherChart.interface";

export default function renderSunFlare(mark: Mark) {
    select("svg").selectAll("g").data([mark]).join(onEnter, onUpdate);
}

function onEnter(enter: any) {
    const g = enter.append("g");
    const gradient = g
        .append("radialGradient")
        .attr("id", "sun-gradient")
        .attr("cx", "50%")
        .attr("cy", "50%");

    appendStop(gradient, "0%", "#FFF76B");
    appendStop(gradient, "50%", "#FFF845");
    appendStop(gradient, "100%", "rgba(255,255,255,0)");
    g.append("rect")
        .attr("fill", "url(#sun-gradient)")
        .attr("width", getSideLength)
        .attr("height", getSideLength)
        .attr("y", (d: Mark) => d.y - getSideLength(d) / 2)
        .attr("x", (d: Mark) => d.x - getSideLength(d) / 2);

    return g;
}

function onUpdate(update: any) {
    return update
        .select("g rect")
        .transition()
        .duration(2000)
        .attr("width", getSideLength)
        .attr("height", getSideLength)
        .attr("y", (d: Mark) => d.y - getSideLength(d) / 2)
        .attr("x", (d: Mark) => d.x - getSideLength(d) / 2);
}

function appendStop(gradient: any, offset: string, stopColor: string) {
    gradient
        .append("stop")
        .attr("offset", offset)
        .attr("stop-color", stopColor);
}
function getSideLength(mark: Mark) {
    return mark.r * 5;
}
