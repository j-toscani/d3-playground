import setData from "./setData";
import "./style.css";

const createDataSet = () =>
    Array.from(new Array(4), () => {
        return {
            cy: Math.floor(Math.random() * 300),
            cx: Math.floor(Math.random() * 300),
            r: Math.floor(Math.random() * 40),
        };
    });

const button = document.querySelector('button');

button?.addEventListener('click', () => {
    setData(createDataSet());
})

