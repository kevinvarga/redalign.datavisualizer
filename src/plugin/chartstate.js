const chartStates = new WeakMap();

export function getState(chart) {
  let state = chartStates.get(chart);
  if (!state) {
    state = {
      startX: -1,
      startY: -1,
      selectedData: 0,
    };
    chartStates.set(chart, state);
  }
  return state;
}

export function removeState(chart) {
  chartStates.delete(chart);
}