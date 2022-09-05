import createArtChart from "../charts/artChart";
import barChart from "../charts/barChart";
import createDotPlot from "../charts/dotPlot";
import createLineChart from "../charts/lineChart";
import randomDots from "../charts/randomDots";
import createSinWave from "../charts/sinWave";

export const charts: Record<string, () => void> = {
    default: randomDots,
    bar: barChart,
    dots: createDotPlot,
    line: createLineChart,
    art: createArtChart,
    sin: createSinWave
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
       charts['default']();
    }
}

export default function initRouter() {
    window.addEventListener("hashchange", setChart);
}
