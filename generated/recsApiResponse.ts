export interface Primaryname {
    nameid: string;
    name: string;
    sortindex: string;
    primaryname: string;
    translit: string;
}

export interface Images {
    thumb: string;
    micro: string;
    square: string;
    squarefit: string;
    tallthumb: string;
    previewthumb: string;
    square200: string;
}

export interface Rankinfo {
    prettyname: string;
    shortprettyname: string;
    veryshortprettyname: string;
    subdomain: string;
    rankobjecttype: string;
    rankobjectid: number;
    rank: string;
    baverage: string;
}

export interface Best {
    min: number;
    max: number;
}

export interface Recommended {
    min: number;
    max?: number;
}

export interface Userplayers {
    best: Best[];
    recommended: Recommended[];
    totalvotes: string;
}

export interface Boardgameweight {
    averageweight: number;
    votes: string;
}

export interface Polls {
    userplayers: Userplayers;
    playerage: string;
    languagedependence: string;
    subdomain: string;
    boardgameweight: Boardgameweight;
}

export interface Stats {
    usersrated: string;
    average: string;
    baverage: string;
    stddev: string;
    avgweight: string;
    numweights: string;
    numgeeklists: string;
    numtrading: string;
    numwanting: string;
    numwish: string;
    numowned: string;
    numprevowned: string;
    numcomments: string;
    numwishlistcomments: string;
    numhasparts: string;
    numwantparts: string;
    views: string;
    playmonth: string;
    numplays: string;
    numplays_month: string;
    numfans: number;
}

export interface ItunesItem {
    link: string;
    artworkUrl60: string;
    trackName: string;
    formattedPrice: string;
}

export interface Item3 {
    rankinfo: Rankinfo[];
    polls: Polls;
    stats: Stats;
    itunes_item: ItunesItem;
}

export interface Dynamicinfo {
    item: Item3;
}

export interface Item2 {
    href: string;
    primaryname: Primaryname;
    images: Images;
    dynamicinfo: Dynamicinfo;
}

export interface Item {
    item: Item2;
}

export interface Rec {
    item: Item;
}

export interface RecsApiResponse {
    recs: Rec[];
    numrecs: number;
}