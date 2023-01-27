const chartStates = new WeakMap();

export const getState = (chart) => {
  let state = chartStates.get(chart);
  if (!state) {
    state = {
      selectedData: 0,
      start: null,
      end: null,
      handlers: {}
    };
    chartStates.set(chart, state);
  }
  return state;
}

export const removeState = (chart) => {
  chartStates.delete(chart);
}