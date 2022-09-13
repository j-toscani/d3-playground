import { max, ScaleContinuousNumeric, scaleLinear, scaleSqrt, Selection } from "d3";
import BaseChart, { BaseChartConfig, BaseChartMark, BaseChartGetters } from "./BaseChart";

interface ScatterplotMark extends BaseChartMark {
    r: number;
}

interface ScatterPlotGetters<T> extends BaseChartGetters<T> {
    r: (d: T) => ScatterplotMark["r"];
}

interface ScatterplotConfig<T> extends BaseChartConfig {
    getters: ScatterPlotGetters<T>
}

export default class Scatterplot<T> extends BaseChart{
    config: ScatterplotConfig<T>;
    domain: Record<keyof ScatterplotMark, [number, number]>;
    range: Record<keyof ScatterplotMark, [number, number]>;
    data: T[];
    selection: null | Selection<SVGSVGElement, any, any, any> = null;

    constructor(data: T[], config: ScatterplotConfig<T>) {
        super(config);
        this.data = data;
        this.config = config;

        this.domain = {
            x: [0, max(this.data, this.getters.x)!],
            y: [0, max(this.data, this.getters.y)!],
            r: [0, (this.config.height / 100) * 2],
        };

        this.range = {
            ...this.baseRange,
            r: [1, (this.config.height / 100) * 2],
        };
    }

    get getters() {
        return this.config.getters;
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

    updateData(data: T[]) {
        this.data = data;
        this._render();
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
}
