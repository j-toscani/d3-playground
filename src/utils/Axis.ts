import {
    axisBottom,
    axisLeft,
    axisRight,
    axisTop,
    ScaleContinuousNumeric,
    Selection,
} from "d3";

export enum AxisType {
    LINEAR,
}

export enum AxisPosition {
    TOP = "top",
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right",
}

export default class Axis {
    position: AxisPosition;

    constructor(position: AxisPosition) {
        this.position = position;
    }

    addToChart(
        selection: Selection<SVGSVGElement, any, any, any>,
        scale: ScaleContinuousNumeric<any, any>
    ) {
        const className = `axis-${this.position}`;
        const g = selection
            .selectAll<SVGGElement, unknown>(`${className}`)
            .data([null])
            .join("g")
            .attr("class", className);

        switch (this.position) {
            case AxisPosition.TOP:
                return g.call(axisTop(scale));
            case AxisPosition.BOTTOM:
                return g.call(axisBottom(scale));
            case AxisPosition.LEFT:
                return g.call(axisLeft(scale));
            case AxisPosition.RIGHT:
                return g.call(axisRight(scale));
        }
    }
}
