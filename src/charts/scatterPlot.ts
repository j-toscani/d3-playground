import { max, ScaleContinuousNumeric, scaleLinear, scaleSqrt, Selection } from "d3";
import Axis, { AxisPosition } from "../utils/Axis";

interface ScatterplotMark {
    x: number;
    y: number;
    r: number;
}

interface ChartMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface ScatterplotConfig<T> {
    width: number;
    height: number;
    margin: ChartMargin;

    getters: {
        x: (d: T) => ScatterplotMark["x"];
        y: (d: T) => ScatterplotMark["y"];
        r: (d: T) => ScatterplotMark["r"];
    };
}

export default class Scatterplot<T> {
    config: ScatterplotConfig<T>;
    domain: Record<keyof ScatterplotMark, [number, number]>;
    range: Record<keyof ScatterplotMark, [number, number]>;
    data: T[];
    selection: null | Selection<SVGSVGElement, any, any, any> = null;

    constructor(data: T[], config: ScatterplotConfig<T>) {
        this.data = data;
        this.config = config;

        this.domain = {
            x: [0, max(this.data, this.getters.x)!],
            y: [0, max(this.data, this.getters.y)!],
            r: [0, (this.config.height / 100) * 2],
        };

        this.range = {
            x: [this.margin.left, this.config.width - this.margin.right],
            y: [this.config.height - this.margin.top, this.margin.bottom],
            r: [1, (this.config.height / 100) * 2],
        };
    }

    get getters() {
        return this.config.getters;
    }

    get margin() {
        return this.config.margin;
    }

    createScales() : Record<keyof ScatterplotMark, ScaleContinuousNumeric<any, any, never>> {
        return {
            x: scaleLinear().domain(this.domain.x).range(this.range.x),
            y: scaleLinear().domain(this.domain.y).range(this.range.y),
            r: scaleSqrt().domain(this.domain.r).range(this.range.r),
        };
    }

    createMarks(data: T[]): ScatterplotMark[] {
        const scales = this.createScales();
        return data.map((d: T) => ({
            x: scales.x(this.getters.x(d)),
            y: scales.y(this.getters.y(d)),
            r: scales.r(this.getters.r(d)),
        }));
    }

    render = (selection: Selection<SVGSVGElement, any, any, any>) => {
        if (!this.selection) {
            this.selection = selection;
        }
        return this._render();
    };

    updateData(data: T[]) {
        this.data = data;
        this._render();
    }

    _render() {
        if (!this.selection) {
            console.warn("No selection available. Data will not be rendered");
            return;
        }
        this._applyMargin(this.selection);
        this._renderAxis(this.selection);
        this._renderMarks(this.selection);

        return this.selection;
    }

    _applyMargin(selection: Selection<SVGSVGElement, any, any, any>) {
        const { width, height } = this.config;
        selection.attr("width", width).attr("height", height);
    }

    _renderMarks(selection: Selection<SVGSVGElement, any, any, any>) {
        selection
            .append("g")
            .selectAll("circle")
            .data(this.createMarks(this.data))
            .join("circle")
            .attr("cy", (d) => d.y)
            .attr("cx", (d) => d.x)
            .attr("r", (d) => d.r);
    }

    _renderAxis(selection: Selection<SVGSVGElement, any, any, any>) {
        const yAxis = new Axis(AxisPosition.LEFT);
        const xAxis = new Axis(AxisPosition.BOTTOM);
        const { x, y } = this.createScales();

        yAxis
            .addToChart(selection, y)
            .attr("transform", `translate(${this.margin.left}, 0)`);

        xAxis
            .addToChart(selection, x)
            .attr(
                "transform",
                `translate(0, ${this.config.height - this.margin.bottom})`
            );
    }
}
