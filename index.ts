import axios from 'axios';
import {interval, Subject} from "rxjs";
import {AsyncCommand, FetchBoardGamesByIdCommand, FetchTopBoardGamesCommand} from "./models";
import {fromPromise} from "rxjs/internal-compatibility";
import {bufferTime, filter, map, take, tap} from "rxjs/operators";
import * as fs from "fs";
import * as path from "path";
import {gameDirectory, gamesToDownload, saveDirectory} from "./utilfuncs";

const subject = new Subject<string>();
const fetchedGames: string[] = [];

const MAX_NUMBER_OF_PAGES = gamesToDownload/100;
interval(2000)
    .pipe(take(MAX_NUMBER_OF_PAGES))
    .subscribe(intervalNumber => {

        new FetchTopBoardGamesCommand(intervalNumber + 1)
            .execute().then(result => {

            result.map(gameUrl => {
                fetchedGames.push(gameUrl);
                return gameUrl.split('/')[2];
            }).forEach(boardGameId => {
                subject.next(boardGameId);
            });

        });


    }, err => console.error(err));

let count = 0;
let emptyEvents = 0;
subject
    .pipe(
        bufferTime(5000)
    )
    .subscribe({
        next: boardGameIds => {
            if (boardGameIds.length > 0) {
                emptyEvents = 0;

                console.log('fetching games ranked ', count * 50, ' to ', (count +1) *  50);
                new FetchBoardGamesByIdCommand(boardGameIds)
                    .execute()
                    .then(result => {
                        const savePath = path.join(saveDirectory,  count.toString() + '.xml');
                        fs.mkdir(saveDirectory, (err) => {
                            fs.writeFile(savePath, result, err => {
                                if (err) {
                                    console.log('err? ', err);
                                }
                            });
                        });

                        count++;
                    })
            } else {
                emptyEvents++;
            }

            if (emptyEvents > 5) {
                subject.complete();
            }

        },
        complete: () => {
            const savePath = path.join(saveDirectory, 'urls.json');
            fs.writeFile(savePath, JSON.stringify(fetchedGames), err => {})
        }
    });