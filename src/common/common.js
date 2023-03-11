export const roundToX = (num, decimals) => {
    decimals = (decimals) ? decimals : 0;
    return +(Math.round(num + "e" + decimals) + "e-" + decimals);
}

export const median = (arr) => {
    if (arr.length === 0) {
      return 0;
    }
    arr.sort((a, b) => a - b); // 1.
    const midpoint = Math.floor(arr.length / 2); // 2.
    const median = arr.length % 2 === 1 ?
      arr[midpoint] : // 3.1. If odd length, just take midpoint
      (arr[midpoint - 1] + arr[midpoint]) / 2; // 3.2. If even length, take median of midpoints
    return median;
}

export const pad = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

export const hashCode = (str) => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export const formatDate = (date) => {
  let scanDate = new Date(date);
  let hours = scanDate.getHours();
  let amPM = "AM";
  
  if(hours === 0) {
      hours = 12;
  } else if((hours - 12) > 0) {
      hours -= 12; 
      amPM = "PM";
  } 
  return `${scanDate.getMonth() + 1}/${scanDate.getDate()} @ ${hours}:${pad(scanDate.getMinutes(), 2)} ${amPM}`;
}