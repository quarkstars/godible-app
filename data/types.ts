export interface IUser {
    objectId: string,
    language?: string, //Can exist when the user is not logged in
    id?: string,
}

export interface IEpisode {
    objectId: string,
    number: number, 
    slug: string,
    book?: IBook,
    customTitle?: string,
    audioPath?: ILangString,
    text?: ILangString,
    chapter?: number,
    chapterName?: ILangString,
    speech?: ISpeech,
    publishedAt?: number,
    searchText?: ILangString,
    imageUrl?: string,
    quote?: string,
}

export interface ILangString {
    defaultLanguage: string, //name of language to default to if the language requested doesn't exist
    english?: string
    japanese?: string,
}

export interface IBook {
    objectId: string,
    title: ILangString,
    slug?: string,
    imageUrl?: string,
}

//TODO: Do the languages mirror each other perfectly?
export interface ISpeech {
    name: ILangString,
    book: IBook,
    startIndex: number,
    endIndex: number,
}