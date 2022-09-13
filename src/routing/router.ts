import createArtChart from "../builders/artChart";
import barChart from "../builders/barChart";
import createDotPlot from "../builders/dotPlot";
import createLineChart from "../builders/lineChart";
import randomDots from "../builders/randomDots";
import buildScatterPlot from "../builders/buildScatterPlot";
import createSinWave from "../builders/sinWave";
import sunRun from "../builders/sunRun";

export const charts: Record<string, () => void> = {
    default: randomDots,
    bar: barChart,
    dots: createDotPlot,
    line: createLineChart,
    art: createArtChart,
    sin: createSinWave,
    scatter: buildScatterPlot,
    sun: sunRun,
};

function setChart(event: HashChangeEvent) {
    const main = document.querySelector("main");

    if (!main) {
        return;
    }

    main.innerHTML = "";

    const hash = event.newURL.split("#")[1];

    if (charts[hash]) {
        charts[hash]();
    } else {
        charts["default"]();
    }
}

export default function initRouter() {
    window.addEventListener("hashchange", setChart);
}
