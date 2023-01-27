import { getState } from "./chartstate.js";
import { addListeners } from "./handler.js";

export const Selector = {
    id: 'selector',
    defaults: {
        select: {
            onDataSelected: 'onDataSelected',
        }
    },
    beforeInit: (chart, args, options) => {
        /* initialize selector */
        let chartState = getState(chart);
        chartState.options = options;

        addListeners(chart, options);
    },
    afterDraw: (chart, args, options) => {
        let chartState = getState(chart);
        if(chartState.end !== null) {
            let left = chartState.start.position.x;
            let width = chartState.end.position.x - chartState.start.position.x;
            const {ctx} = chart;
            ctx.save();
            ctx.fillStyle = 'rgba(225,225,225,0.3)';
            ctx.fillRect(left, chart.chartArea.top, width, chart.chartArea.height);
            ctx.restore();
        }
        
    }
}