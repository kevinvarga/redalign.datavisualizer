export const roundToX = (num, decimals) => {
    decimals = (decimals) ? decimals : 2;
    return +(Math.round(num + "e" + decimals) + "e-" + decimals);
}