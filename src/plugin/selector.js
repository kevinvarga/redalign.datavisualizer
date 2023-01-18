import { getState } from "./chartstate.js";

export const Selector = {
    id: 'selector',
    beforeInit: (chart, args, options) => {
        /* initialize selector */
    },
    afterDraw: (chart, args, options) => {
        let chartState = getState(chart);
        if(chartState.endX & chartState.endY) {
            let left = chartState.startX;
            let width = chartState.endX - chartState.startX;
            const {ctx} = chart;
            ctx.save();
            ctx.fillStyle = 'rgba(225,225,225,0.3)';
            ctx.fillRect(left, chart.chartArea.top, width, chart.chartArea.height);
            ctx.restore();
        }
        
    }
}