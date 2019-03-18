import axios from 'axios';
import {interval, Subject} from "rxjs";
import {AsyncCommand, FetchBoardGamesByIdCommand, FetchTopBoardGamesCommand} from "./models";
import {fromPromise} from "rxjs/internal-compatibility";
import {bufferTime, filter, map, take, tap} from "rxjs/operators";
import * as fs from "fs";
import * as path from "path";

const subject = new Subject<string>();

const MAX_NUMBER_OF_PAGES = 3;
interval(2000)
    .pipe(take(MAX_NUMBER_OF_PAGES))
    .subscribe(intervalNumber => {

        new FetchTopBoardGamesCommand(intervalNumber + 1)
            .execute().then(result => {

            result.map(gameUrl => {
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
    .subscribe(boardGameIds => {
        console.log('received boardgame ids: ', boardGameIds.length);
        if (boardGameIds.length > 0) {
            emptyEvents = 0;

            new FetchBoardGamesByIdCommand(boardGameIds)
                .execute()
                .then(result => {
                    const savePath = path.join(__dirname, 'pulled-data', count.toString());
                    fs.writeFile(savePath, result, err => {
                        if (err) {
                            console.log('err? ', err);
                        }
                    });
                    count++;
                })
        } else {
            emptyEvents++;
        }

        if (emptyEvents > 5) {
            subject.complete();
        }

    });