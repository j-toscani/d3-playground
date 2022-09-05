import {
    range,
    select,
    selectAll,
    symbol,
    symbolCircle,
    symbolCross,
    symbolDiamond,
} from "d3";
import createButtonContainer from "../utils/createButtonContainer";

const width = 610;
const height = 410;
const lineWidth = 10;

export default function createArtChart() {
    select("main").append("svg").attr("width", width).attr("height", height);

    const innerId = "inner-mask";
    const outerId = "outer-mask";

    select("svg").append("mask").attr("id", outerId);
    select("svg").append("mask").attr("id", innerId);

    createLines([
        ...createHorizontalData(innerId),
        ...createVerticalData(outerId),
    ]);

    const container = createButtonContainer();

    createCircleMask(innerId, "white");
    createOuterMask(outerId, createCircleMask);
    [
        { name: "Rect", maskCreator: createRectMask },
        { name: "Symbol", maskCreator: createSymbolMasks },
        { name: "Circle", maskCreator: createCircleMask },
    ].forEach(({ name, maskCreator }) => {
        const button = document.createElement("button");
        button.textContent = `Use ${name} mask`;
        container?.append(button);

        button.addEventListener("click", () => {
            clearMasks();
            maskCreator(innerId, "white");
            createOuterMask(outerId, maskCreator);
        });
    });

    const button = document.createElement("button");

    if (button) {
        button.textContent = "Switch Lines";
        button.addEventListener("click", () => swithLines([innerId, outerId]));
        container?.append(button);
    }
}

type ArtLine = {
    width: number;
    height: number;
    x: number;
    y: number;
    mask: string;
};

function swithLines(ids: string[]) {
    const first = selectAll(`rect[mask="url(#${ids[0]})"]`)
    const second = selectAll(`rect[mask="url(#${ids[1]})"]`)
    first.attr("mask", `url(#${ids[1]})`);
    second.attr("mask", `url(#${ids[0]})`);
}

function createLines(data: ArtLine[]) {
    select("svg")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("mask", ({ mask }) => `url(#${mask})`)
        .attr("width", ({ width }) => width)
        .attr("height", ({ height }) => height)
        .attr("y", ({ y }) => y)
        .attr("x", ({ x }) => x);
}

function createHorizontalData(maskId: string) {
    const horizontalCount = Math.ceil(
        Math.floor(height / lineWidth - (height % lineWidth)) / 2
    );

    return range(horizontalCount).map((_e, i) => ({
        mask: maskId,
        height: lineWidth,
        width,
        y: i * lineWidth * 2,
        x: 0,
    }));
}

function createVerticalData(maskId: string) {
    const verticalCount = Math.ceil(
        Math.floor(width / lineWidth - (width % lineWidth)) / 2
    );

    return range(verticalCount).map((_e, i) => ({
        mask: maskId,
        height,
        width: lineWidth,
        x: i * lineWidth * 2,
        y: 0,
    }));
}

function createOuterMask(
    maskId: string,
    maskCreator: (id: string, color: "black" | "white") => void
) {
    select(`#${maskId}`)
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "white");

    maskCreator(maskId, "black");
}

function clearMasks() {
    selectAll("mask").selectChildren().remove();
}

function createCircleMask(id: string, color: "black" | "white") {
    select(`#${id}`)
        .append("path")
        .attr("d", symbol(symbolCircle, 320 * 320)())
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .attr("fill", color);
}

function createSymbolMasks(id: string, color: "white" | "black") {
    const size = 120 * 120;
    const g = select(`#${id}`);
    const diamond = g.append("path").attr("d", symbol(symbolDiamond, size)());
    const circle = g.append("path").attr("d", symbol(symbolCircle, size)());
    const cross = g.append("path").attr("d", symbol(symbolCross, size)());

    [diamond, cross, circle].forEach((element) => element.attr("fill", color));

    diamond.attr("transform", `translate(${(width - 20) / 6}, ${height / 2})`);
    circle.attr(
        "transform",
        `translate(${((width - 20) / 6) * 3}, ${height / 2})`
    );
    cross.attr(
        "transform",
        `translate(${((width - 20) / 6) * 5}, ${height / 2})`
    );
}

function createRectMask(maskId: string, color: "black" | "white") {
    const rWidth = 340;
    const rHeight = 340;

    select(`#${maskId}`)
        .append("rect")
        .attr("x", width / 2 - rWidth / 2)
        .attr("y", height / 2 - rHeight / 2)
        .attr("width", rWidth)
        .attr("height", rHeight)
        .attr("fill", color);
}
