import { callback as call, getRelativePosition, isFunction } from "chart.js/helpers";
import { getState, removeState } from "./chartstate";

const removeHandler = (chart, type) => {
    const {handlers} = getState(chart);
    const handler = handlers[type];
    if (handler && handler.target) {
      handler.target.removeEventListener(type, handler);
      delete handlers[type];
    }
  }

const addHandler = (chart, target, type, handler) => {
    const {handlers, options} = getState(chart);
    const oldHandler = handlers[type];
    if (oldHandler && oldHandler.target === target) {
        // already attached
        return;
    }
    removeHandler(chart, type);
    handlers[type] = (event) => handler(chart, event, options);
    handlers[type].target = target;
    target.addEventListener(type, handlers[type]);
}

export const addListeners = (chart) => {
    const canvas = chart.canvas;

    addHandler(chart, canvas, 'mousedown', handleMouseDown);
    addHandler(chart, canvas, 'mousemove', handleMouseMove);
    addHandler(chart, canvas, 'mouseup', handleMouseUp);
}

const getXY = (event, chart) => {
    const canvasPosition = getRelativePosition(event, chart);
    
    // Substitute the appropriate scale IDs
    const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
    const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
    return {
        data: {
            x:dataX, 
            y:dataY
        },
        position: {
            x: canvasPosition.x,
            y: canvasPosition.y
    }};
}

const handleMouseDown = (chart, event, options) => {
    let chartState = getState(chart);
    chartState.start = getXY(event, chart);
    chartState.end = null;
    chart.update();
}


const handleMouseMove = (chart, event, options) => {
    if(event.buttons) {
        let chartState = getState(chart);
        chartState.end = getXY(event, chart);
        chart.update();
    }
}

const handleMouseUp = (chart, event, options) => {
    let chartState = getState(chart);

    if(chartState.start) {
        let endData = getXY(event, chart);
        if (Object.prototype.hasOwnProperty.call(chart.options.select, 'onDataSelected') &&
            isFunction(chart.options.select.onDataSelected)) {
            let startData = chartState.start;
            call(chart.options.select.onDataSelected, [startData, endData]);
        }

        removeState(chart);
        chartState = getState(chart);
        chartState.options = options;
        chart.update();
        
    }
}