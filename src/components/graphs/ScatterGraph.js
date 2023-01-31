import React, { useEffect, useRef } from "react";
import {
    Chart,
    ScatterController,
    LinearScale, PointElement, LineElement, Legend, Title,
    CategoryScale
} from 'chart.js';
import { Selector } from "../../plugin/selector";
import Zoom from "chartjs-plugin-zoom";

Chart.register(ScatterController, LinearScale, CategoryScale, PointElement, LineElement, Legend, Selector, Zoom, Title);

export default function ScatterGraph(props) {
    const scatterChart = useRef(null);
    const contentId = useRef(null);
    const {data, min, max, reset, content, options} = props;
    contentId.current = content.id;

    useEffect(() => {
        console.log("scatterGraph.useEffect");
        console.log(data);
        if(!contentId.current && !scatterChart.current) {
            scatterChart.current = new Chart(content.ref.current, options);
            contentId.current = content.id;
        } else if(scatterChart && scatterChart.current && data) { 
            if(reset) {
                scatterChart.current.destroy();
                scatterChart.current = null;
                contentId.current = null;
            } else {

                for(let i=0;i<data.length;i++){
                    if(data[i].length > 0){
                        scatterChart.current.data.datasets[i].data = data[i];
                    }
                }

                scatterChart.current.options.scales.x.min = min.x;
                scatterChart.current.options.scales.x.max = max.x;
                scatterChart.current.options.scales.y.min = min.y;
                scatterChart.current.options.scales.y.max = max.y;
                
                scatterChart.current.update();
            }
        }
    }, [data, min, max, reset, content, options, scatterChart]);

    return (
        <>
            {content}
        </>  
    );
}

