export interface IUser {
    language?: string, //Can exist when the user is not logged in
    id?: string,
}

export interface IEpisode {
    number: number, 
    book: IBook,
    audioPath: ILangString,
    chapter?: number,
    chapterName?: ILangString,
    speech?: ISpeech,
    publishedAt?: number,
    searchText?: ILangString,
}

export interface ILangString {
    defaultLanguage: string, //name of language to default to if the language requested doesn't exist
    english?: string,
    japanese?: string,
}

export interface IBook {
    name: ILangString,
}

//TODO: Do the languages mirror each other perfectly?
export interface ISpeech {
    name: ILangString,
    book: IBook,
    startIndex: number,
    endIndex: number,
}