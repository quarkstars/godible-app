export interface IUser {
    language?: string, //Can exist when the user is not logged in
    id?: string,
}

export interface IEpisode {
    number: number, 
    slug: string,
    book?: IBook,
    customTitle?: string,
    audioPath: ILangString,
    chapter?: number,
    chapterName?: ILangString,
    speech?: ISpeech,
    publishedAt?: number,
    searchText?: ILangString,
    imageUrl?: string,
}

export interface ILangString {
    defaultLanguage: string, //name of language to default to if the language requested doesn't exist
    english?: string
    japanese?: string,
}

export interface IBook {
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