import setData from "./utils/setDotData";
import "./style.css";
import {select} from "d3";

const createDataSet = (width = 600, height = 400, radius = 50) =>
    Array.from(new Array(4), () => {
        return {
            cy:  Math.floor(Math.random() * (height - radius * 2)) + radius,
            cx: Math.floor(Math.random() * (width - radius * 2)) + radius,
            r: Math.floor(Math.random() * (radius - radius * 0.2)) + radius * 0.2,
        };
    });

[1,2,3,4].forEach(()=>{ select('svg').append('circle')});
const button = document.querySelector('button');

button?.addEventListener('click', () => {
    setData(createDataSet());
})

