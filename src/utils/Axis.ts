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
    type: AxisType;
    position: AxisPosition;

    constructor(position: AxisPosition, type = AxisType.LINEAR) {
        this.type = type;
        this.position = position;
    }

    addToChart(
        selection: Selection<SVGSVGElement, any, any, any>,
        scale: ScaleContinuousNumeric<any, any>
    ) {
        const className = `axis-${this.position}`;
        let g = selection.select<SVGGElement>(`.${className}`);
       
        if (g.empty()) {
            g = selection.append("g").attr("class", className);
        }

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
