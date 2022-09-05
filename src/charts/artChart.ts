import { range, select, selectAll } from "d3";

const width = 610;
const height = 410;
const lineWidth = 10;

export default function createArtChart() {
    select("main").append("svg").attr("width", width).attr("height", height);

    const innerId = "inner-mask";
    const outerId = "outer-mask";

    select("svg").append("mask").attr("id", outerId);
    select("svg").append("mask").attr("id", innerId);

    createLines([...createHorizontalLines(outerId), ...createVerticalLines(innerId)]);

    createCircleMask(innerId, "white");
    createOuterMask(outerId, createCircleMask);

    [
        { name: "Rect", maskCreator: createRectMask },
        { name: "Circle", maskCreator: createCircleMask },
    ].forEach(({ name, maskCreator }) => {
        const button = document.createElement("button");
        button.textContent = `Use ${name} mask`;
        document.querySelector("main")?.append(button);

        button.addEventListener("click", () => {
            clearMasks();
            maskCreator(innerId, "white");
            createOuterMask(outerId, maskCreator);
        });
    });
}

type ArtLine = {
    width: number;
    height: number;
    x: number;
    y: number;
    mask: string;
};

function createLines(data: ArtLine[]) {
    select("svg").
    selectAll("rect")
        .data(data)
        .join("rect")
        .attr("mask", ({ mask }) => `url(#${mask})`)
        .attr("width", ({ width }) => width)
        .attr("height", ({ height }) => height)
        .attr("y", ({ y }) => y)
        .attr("x", ({ x }) => x);
}

function createHorizontalLines(maskId: string) {
    const horizontalCount =
        Math.ceil(Math.floor(height / lineWidth - (height % lineWidth)) / 2);

    return range(horizontalCount).map((_e, i) => ({
        mask: maskId,
        height: lineWidth,
        width,
        y: i * lineWidth * 2,
        x: 0,
    }));
}

function createVerticalLines(maskId: string) {
    const verticalCount =
       Math.ceil(Math.floor(width / lineWidth - (width % lineWidth)) / 2);

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
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", 170)
        .attr("fill", color);
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
