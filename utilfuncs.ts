import * as path from "path";

let currentPercentage = -1;
export const todaysDate = `${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
export const gameDirectory = process.env['__OUTPUT_FOLDER__'] || todaysDate;
export const saveDirectory = path.join(__dirname,'pulled-data', gameDirectory);
export const gamesToDownload = parseInt(process.env['__DOWNLOAD_COUNT__'] || '100');

export const displayPercentageCompletion = (currentNumber: number, total: number) => {
    const percentage = Math.floor((currentNumber/ total) * 100);

    if (percentage != currentPercentage) {
        console.log(` ${currentNumber}/${total} done (${percentage}%)`);
    }

    currentPercentage = percentage;
};