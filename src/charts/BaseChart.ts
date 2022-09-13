import { Selection } from "d3-selection";
import Axis, { AxisPosition } from "../utils/Axis";

export interface ChartMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface BaseChartMark {
    x: number,
    y: number
}

export interface BaseChartGetters<T> {
    x: (d: T) => BaseChartMark["x"];
    y: (d: T) => BaseChartMark["y"];
}

export interface BaseChartConfig {
    width: number,
    height: number,
    margin: ChartMargin,
}

export default abstract class BaseChart {
    baseRange: Record<'x' | 'y', [number, number]>
    selection: null | Selection<SVGSVGElement, any, any, any> = null
    config: BaseChartConfig

    constructor(config: BaseChartConfig) {
        this.baseRange = {
            x: [config.margin.left, config.width - config.margin.right],
            y: [config.height - config.margin.top, config.margin.bottom]
        }

        this.config = config;
    }

    get margin() {
        return this.config.margin;
    }

    abstract createScales() : { x: any, y: any } 
    abstract _renderMarks(selection: Selection<SVGSVGElement, any, any, any>) : void

    _applyMargin(selection: Selection<SVGSVGElement, any, any, any>) {
        const { width, height } = this.config;
        selection.attr("width", width).attr("height", height);
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

    render = (selection: Selection<SVGSVGElement, any, any, any>) => {
        if (!this.selection) {
            this.selection = selection;
        }
        return this._render();
    };

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