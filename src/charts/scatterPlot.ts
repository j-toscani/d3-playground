import {csv} from "d3"

export default async function createScatterPlot() {
   const data = await getRemoteData();
}

async function getRemoteData(){
    const url = "https://gist.githubusercontent.com/netj/8836201/raw/6f9306ad21398ea43cba4f7d537619d0e07d5ae3/iris.csv"
    const rawData = await csv(url); 

    console.table(rawData);

    return rawData;
}


