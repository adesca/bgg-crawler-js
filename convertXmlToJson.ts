import * as fs from "fs";
import * as path from "path";
import * as xmldoc from 'xmldoc';
import {getAttributeFromChildWithName, getValuesFromChildrenWithNameAndType} from "./util";
import {gameDirectory, saveDirectory} from "./utilfuncs";


const filesInDirectory = fs.readdirSync(saveDirectory);

let allGames: Game[] = [];
filesInDirectory.filter(fileName => fileName.endsWith('.xml'))
    .map(fileName => {
        const fileToRead = path.join(saveDirectory, fileName);
        return fs.readFileSync(fileToRead).toString();
    })
    .map(fileAsXml => {
        const gamesAsXml = new xmldoc.XmlDocument(fileAsXml);
        const games = gamesAsXml.childrenNamed('item');
        return games.map(gameAsXml => {
            const gameAsJson = {} as Game;

            const nameElements = gameAsXml.childrenNamed("name");
            const potentialName = nameElements.find(el => el.attr.type === 'primary');
            if (potentialName) {
                gameAsJson.name = potentialName.attr.value;
            }


            gameAsJson.id = gameAsXml.attr.id;
            gameAsJson.minplayers = parseInt(getAttributeFromChildWithName('value', 'minplayers', gameAsXml));
            gameAsJson.maxplayers = parseInt(getAttributeFromChildWithName('value', 'maxplayers', gameAsXml));
            gameAsJson.minplaytime = parseInt(getAttributeFromChildWithName('value', 'minplaytime', gameAsXml));
            gameAsJson.maxplaytime = parseInt(getAttributeFromChildWithName('value', 'maxplaytime', gameAsXml));

            gameAsJson.description = gameAsXml.childNamed('description')!.val;

            gameAsJson.categories = getValuesFromChildrenWithNameAndType('link', 'boardgamecategory', gameAsXml);
            gameAsJson.mechanics = getValuesFromChildrenWithNameAndType('link', 'boardgamemechanic', gameAsXml);
            gameAsJson.family = getValuesFromChildrenWithNameAndType('link', 'boardgamefamily', gameAsXml);
            gameAsJson.expansions = getValuesFromChildrenWithNameAndType('link', 'boardgameexpansion', gameAsXml);
            gameAsJson.designer = getValuesFromChildrenWithNameAndType('link', 'boardgamedesigner', gameAsXml);
            gameAsJson.publishers = getValuesFromChildrenWithNameAndType('link', 'boardgamepublisher', gameAsXml);


            return gameAsJson;
        })
    }).forEach(gameAsJson => {
    allGames = allGames.concat(gameAsJson);
});

const gamesAsJsonPath = path.join(saveDirectory, 'games.json');
fs.writeFileSync(gamesAsJsonPath, JSON.stringify(allGames, null, 2));

export interface Game {
    name: string;
    id: string;
    minplaytime: number;
    maxplaytime: number;
    minplayers: number;
    maxplayers: number;
    description: string;
    categories: string[];
    mechanics: string[];
    family: string[];
    expansions: string[];
    designer: string[];
    publishers: string[];

    complexity: number;
    gamesOtherPeopleLiked: string[]
}