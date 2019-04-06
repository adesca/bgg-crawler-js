import axios from 'axios';
import cheerio from 'cheerio';

export interface AsyncCommand {
    execute: () => Promise<any>;
}

export class FetchTopBoardGamesCommand implements AsyncCommand {
    private AxiosConfig = {
        method: 'get',
        url: 'https://boardgamegeek.com/browse/boardgame',
        responseType: 'text'
    };

    constructor(private page: number = 1) {

    }

    execute = () => {
        const url = `https://boardgamegeek.com/browse/boardgame/page/${this.page}`;

        console.log(`fetching page ${this.page}`);
        return axios.get<string>(url, {responseType: 'text'})
            .then(response => {
                if (response.status != 200) {
                    console.error('received response from bgg with status ', response.status);
                }
                return response.data
            })
            .then(html => {
                const $ = cheerio.load(html);
                return $('tr#row_ .collection_objectname a')
                    .map((index, element) => {
                        return $(element).attr('href')
                    }).toArray() as unknown as string[];
            })
    }

}

export class FetchBoardGamesByIdCommand implements AsyncCommand {

    constructor(private gameId: string[]) { }

    execute = () => {
        const concatedGameIds = this.gameId.join(',');

        const url = `https://boardgamegeek.com/xmlapi2/thing?id=${concatedGameIds}`;
        return axios.get<string>(url, {responseType: 'xml'})
            .then(response => {
                // const itemsAsXml = new xmldoc.XmlDocument(response.data);
                return response.data
            })
    };

}