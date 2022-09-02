import setData from "./setData";
import "./style.css";

const createDataSet = () =>
    Array.from(new Array(4), () => {
        return {
            cy: Math.floor(Math.random() * 300),
            cx: Math.floor(Math.random() * 300),
            r: Math.floor(Math.random() * 50),
        };
    });

const dataSets = [
    createDataSet(),
    createDataSet(),
    createDataSet(),
    createDataSet(),
];

const buttons = document.querySelectorAll('button');

console.log(dataSets);

buttons.forEach((button, i) => {
    button.addEventListener('click', () => {
        setData(dataSets[i])
    })
})

