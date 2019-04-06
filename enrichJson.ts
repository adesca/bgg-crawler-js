import * as path from "path";
import * as fs from "fs";
import {Game} from "./convertXmlToJson";
import {interval, Observable, Subject} from "rxjs";
import axios from 'axios';
import {delay, map, take} from "rxjs/operators";
import {RecsApiResponse} from "./generated/recsApiResponse";
import {Readable} from "stream";
import {Transform} from "json2csv";
import {tap} from "rxjs/internal/operators/tap";
import {displayPercentageCompletion, gameDirectory, saveDirectory, todaysDate} from "./utilfuncs";

console.log('using directory ', saveDirectory);
const gamesAsJsonPath = path.join(saveDirectory, 'games.json');
const games: Game[] = JSON.parse(fs.readFileSync(gamesAsJsonPath).toString());

const subject = new Subject<Game>();

const ref = interval(1000)
    .pipe(
        tap(index => displayPercentageCompletion(index, games.length)),
        map(index => games[index]),
        take(games.length)
    )
    .subscribe({
        next: (game) => {
            if (game) {
                const url = `https://api.geekdo.com/api/geekitem/recs?ajax=1&objectid=${game.id}&objecttype=thing&pageid=1`;
                // console.log('enriching ', url);
                // console.log('fetching ', game.id);
                axios.get<RecsApiResponse>(url).then(response => {
                    if (response.status < 200 || response.status > 300) {
                        console.log('something happened ', response);
                        return response.data;
                    } else {
                        return response.data
                    }
                })
                    .then((json: RecsApiResponse) => {
                        // console.log('received item with id ', game.id);
                        const recs=  json.recs;
                        // recs.forEach(rec => {
                        //     const difficulty = rec['item']['item']['dynamicinfo']['item']['stats']['avgweight'];
                        //
                        // })
                        const difficulty = recs[0].item.item.dynamicinfo.item.stats.avgweight;
                        // const difficulty = recs[0]['item']['item']['dynamicinfo']['item']['stats']['avgweight'];
                        game.complexity = parseInt(difficulty);

                        const otherGameReccomendations = recs.slice();
                        game.gamesOtherPeopleLiked = otherGameReccomendations.map(otherGame => otherGame.item.item.href);

                        subject.next(game);
                    })
            } else {
                // subject.next(undefined);
                ref.unsubscribe();
            }
        },
        complete: () => {
        }
    });

const json2csv = new Transform({}, { objectMode: true });
const input = new Readable( {objectMode: true});
input._read = () => {};

const outputFile = fs.createWriteStream(path.join(saveDirectory, `${todaysDate}.csv`));
input.pipe(json2csv).pipe(outputFile);
subject.subscribe(game => {
    console.log('writing game to csv ', game.name);
    input.push(game);
});
