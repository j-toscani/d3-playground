import { easeLinear, max, min, scaleLinear, select, selectAll } from "d3";
import {
    DailyWeather,
    HourlyWeather,
    Mark,
    WeatherData,
} from "./weatherChart/weatherChart.interface";

const defaultUrl =
    "https://api2.wetter.de/api/v1/dayboxes?filter%5Bgeohash%5D=u1hcy";

const width = 1200;
const height = 400;

export default async function createSunRun() {
    const data = await getWatherData();
    const marks = prepareDayData(data[0]); 
    const scaledMarks = createScaledMarks(marks);

    const svg = select("main").append("svg");
    svg.attr("width", width).attr("height", height);

    for (let index = 0; index < scaledMarks.length; index++) {
        select("svg")
            .selectAll("g")
            .data([scaledMarks[index]])
            .join(onEnter, onUpdate);

        const transitionPromise = new Promise((res, _rej) => {
            setTimeout(res, 1000);
        });
        await transitionPromise;
    }
}

function createScaledMarks(marks: Mark[]): Mark[] {
    const scaleX = scaleLinear().domain([0, 23]).range([0, width]);
    const scaleY = scaleLinear().domain([-35, 50]).range([height, 0]);
    const scaleR = scaleLinear().domain([0, 60]).range([20, 70]);

    const scaledMarks = marks.map((mark) => ({
        x: scaleX(mark.x),
        y: scaleY(mark.y),
        r: scaleR(mark.r),
        time: mark.time,
        color: mark.color,
    }));

    return scaledMarks;
}

function onEnter(svg: any) {
    const g = svg.append("g");
    g.call(enterBackground);
    g.call(enterSun);
    g.call(enterForeGround);

    g.call(updateBackground);
    g.call(updateSun);

    return svg;
}

function onUpdate(svg: any) {
    svg.call(updateBackground);
    svg.call(updateSun);
    return svg;
}
function enterBackground(svg: any) {
    return svg
        .append("rect")
        .attr("class", "bg")
        .attr("width", width)
        .attr("height", height);
}

function updateBackground(svg: any) {
    return svg
        .select(".bg")
        .transition()
        .duration(2000)
        .ease(easeLinear)
        .attr("fill", (d: Mark) => `hsl(${260 - d.time}, 100%, ${40 +d.time}%)`);
}

function enterForeGround(svg: any) {
    return svg
        .append("rect")
        .attr("class", "fg")
        .attr("width", width)
        .attr("height", height / 2)
        .attr("y", height / 2).attr("fill", "brown").attr("style", "opacity: 0.8");
}

function enterSun(svg: any) {
    const gradient = svg.append("defs").append("radialGradient");
    gradient.attr("id", "sun-gradient");

    gradient.call(addGradientStop, "0%", "#FFF76B");
    gradient.call(addGradientStop, "50%", "#FFF845");
    gradient.call(addGradientStop, "100%", "rgba(255,255,255,0");
    gradient.select("stop").attr("class", "warmth");

    return svg
        .append("circle")
        .attr("class", "sun")
        .attr("fill", "url(#sun-gradient)");
}

function updateSun(svg: any) {
    svg.select(".warmth").attr(
        "stop-color",
        (d: Mark) => `hsl(${d.color}, 100%, 50%)`
    );

    return svg
        .select(".sun")
        .transition()
        .duration(2000)
        .ease(easeLinear)
        .attr("cy", (d: Mark) => d.y)
        .attr("cx", (d: Mark) => d.x)
        .attr("r", (d: Mark) => d.r);
}

function addGradientStop(gradient: any, offset: string, stopColor: string) {
    gradient
        .append("stop")
        .attr("offset", offset)
        .attr("stop-color", stopColor);
}

function addTransition(element: any) {
    element.transition().duration(1000).ease(easeLinear);
}

function prepareDayData(data: DailyWeather) {
    const getMark = createGetMark(data.attributes.hourly[0].dateTime);
    return data.attributes.hourly.map(getMark);
}

function createGetMark(referenceDate: string) {
    const dayStart = new Date(referenceDate).getTime();
    return (data: HourlyWeather) => {
        const currentTime = new Date(data.dateTime).getTime();
        return {
            x: toHours(currentTime - dayStart),
            y: data.sunElevation,
            r: data.sunMinutes + 30,
            time: data.sunElevation,
            color: Math.floor(30 + (240 * (30 - data.temp)) / 60),
        };
    };
}

function toHours(ms: number) {
    return Math.floor(ms / 1000 / 60 / 60);
}

async function getWatherData(url = defaultUrl): Promise<WeatherData["data"]> {
    const request = await fetch(url);

    if (!request.ok) {
        console.error("Request was not successful");
        return [];
    }

    const data = await request.json();
    return data.data;
}
