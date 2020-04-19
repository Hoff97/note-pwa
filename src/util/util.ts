export function formatNumber(number: number) {
    if (number < 10) {
        return `0${number}`;
    }
    return number;
}

export function formatDate(date: Date) {
    return `@date(${date.getFullYear()},${formatNumber(date.getMonth() + 1)},${formatNumber(date.getDate())})`;
}