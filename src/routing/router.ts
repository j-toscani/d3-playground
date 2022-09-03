import barChart from "../charts/barChart";
import randomDots from "../charts/randomDots";

export const charts: Record<string, () => void> = {
    default: randomDots,
    bar: barChart
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
