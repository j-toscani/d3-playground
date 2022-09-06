import { select, min, max, axisLeft, axisBottom, scaleLinear } from "d3";

type Mark = {
    x: number;
    y: number;
};

type Domain = [number, number];

const defaultWidth = 1200;
const defaultHeight = 800;

const defaultMargin = {
    bottom: 20,
    top: 20,
    right: 30,
    left: 30,
}; 

export default function addAxisFactory(
    svg: any,
    dimensions: {
        width?: number;
        height?: number;
        margin?: { bottom: number; top: number; left: number; right: number };
    } = {}
) {
    const {
        width = defaultWidth,
        height = defaultHeight,
        margin = defaultMargin,
    } = dimensions;
    return (xDomain: Domain, yDomain: Domain) => {
        const scaleX = createScale(xDomain, [
            margin.left,
            width - margin.right,
        ]);

        const scaleY = createScale(yDomain, [
            height - margin.top,
            margin.bottom,
        ]);

        createAxis(svg, scaleY, [margin.left, 0]);
        createAxis(svg, scaleX, [0, height - margin.bottom]);

        return {
            scaleX,
            scaleY
        }
    };
}

function createAxis(svg: any, scale: any, translate: [number, number]) {
    const axisToAdd = translate[0] < translate[1] ? axisBottom : axisLeft;
    svg.append("g")
        .attr("transform", `translate(${translate[0]}, ${translate[1]})`)
        .call(axisToAdd(scale));
}

function createScale(domain: [number, number], range: [number, number]) {
    return scaleLinear().domain(domain).range(range);
}
