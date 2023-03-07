export interface IUser {
    objectId?: string,
    language?: string, //Can exist when the user is not logged in
    fontSize?: string, //md, lg, xl
    fontContrast?: string, //full, 800, 600
    fontStyle?: string, //serif, sanserif
    savedEpisodeIds?: string[],
}

export interface IList {
    objectId?: string, //Will not be defined if not
    name?: string,
    user?: IUser,
    episodes: IEpisode[],
}

export interface IEpisode {
    objectId: string,
    number: number, 
    slug: string,
    book?: IBook,
    customTitle?: string,
    audioPath?: ILangString,
    text?: ILangString,
    chapter?: number|string,
    chapterName?: ILangString,
    speech?: ISpeech,
    publishedAt?: number,
    searchText?: ILangString,
    imageUrl?: string,
    quote?: string,
    isForbidden?: boolean,
    metaData?: ILangString,

    //Constructed client-side strings based on episode data
    _lang?: string,
    _bookImageUrl?: string,
    _bookPath?: string,
    _bookTitle?: string,
    _path?: string,
    _title?: string,
    _fullTitle?: string,
    _hasChapter?: boolean,
    _chapterName?: string,
    _chapterPath?: string,
    _textBlocks?: string[],
    _authorImageUrl?: string,
    _metaDataBlocks?: string[],


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
    authorImageUrl?: string,
    author?: ILangString,
    metaData?: ILangString,
    description?: ILangString,
    buyLink?: ILangString,
}

//TODO: Do the languages mirror each other perfectly?
export interface ISpeech {
    name: ILangString,
    book: IBook,
    startIndex: number,
    endIndex: number,
}