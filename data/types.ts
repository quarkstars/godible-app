export interface ParseObjectToJson {
    objectId?: string,
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    className?: string;
}

export interface IUser extends ParseObjectToJson {

    language?: string, //Can exist when the user is not logged in
    fontSize?: string, //small, normal, large
    fontContrast?: string, //light, normal, strong
    fontStyle?: string, //serif, sanserif

    //Simple list of all pointers
    lists?: IList[]
    savedListId?: string,

    email?: string,
    imageUrl?: string,
    firstName?: string,
    lastName?: string,

    //
    heartCount?: number,
    flagCount?: number,

    
    currentStreak?: number,
    maxStreak?: number,
    listeningSecondsTotal?: number,

    lastEpisode?: IEpisode,
    lastListId?: string,
    lastEpisodePercent?: number,
    lastEpisodeSeconds?: number,
}

export interface IList extends ParseObjectToJson {
    name?: string,
    user?: IUser,
    episodes: IEpisode[],

    // If came from a speech, the metaData will be added here. 
    description?: string,
    
    //Perhaps used if the user can share it
    // isPublic?: boolean,

    //Do I need this to make a relation?
    __type?: "Pointer", 
    //The user's lists will be ordered by the index. "Saved" list will always be index 0
    index?: number
}

export interface IExactQuery {
    ["key"]?: string,
}

export interface IEpisode extends ParseObjectToJson {
    objectId: string,
    number: number, 
    slug: string,
    book?: IBook,
    customTitle?: ILangString,
    audioPath?: ILangString,
    text?: ILangString,
    chapterNumber?: number|string,
    chapterName?: ILangString,
    speech?: ISpeech,
    publishedAt?: number,
    searchText?: string,
    imageUrl?: string,
    thumbUrl?: string,
    quote?: ILangString,
    metaData?: ILangString,
    episodeTotal?: number,
    topics?: ITopic[],
    isFreeSample?: boolean,

    isForbidden?: boolean, 
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
    _quote?: string,


}

export interface ILangString {
    defaultLanguage: string, //name of language to default to if the language requested doesn't exist
    english?: string
    japanese?: string,
}

export interface IBook extends ParseObjectToJson{
    objectId: string,
    title: ILangString,
    slug?: string,
    imageUrl?: string,
    thumbUrl?: string,
    authorImageUrl?: string,
    author?: ILangString,
    metaData?: ILangString,
    description?: ILangString,
    tagline?: ILangString,
    buyLink?: ILangString,
    isPublic?: boolean,
}

export interface ISpeech extends IList {
    title?: ILangString,
    slug?: string, //This would be book slug+speech name
    // book?: IBook, 
    metaData?: ILangString,
    //If the speech is only available in a certain language
    language?: string,
}

export interface IInspiration extends ParseObjectToJson {
    episodeId?: IEpisode, //name, slug, number, image
    userId?: string,
    bookId?: string,
    isPublic?: boolean,
    text?: string,
    user?: IUser,
    flagCount?: number,
    heartCount?: number,
    //Appended when delivered to client
    _isHearted: boolean,
    _isFlagged: boolean,
}

//TODO: Is this necessary to have on the client?
export interface IInspirationFeedback extends ParseObjectToJson {
    userId?: string,
    inspirationId?: string,
    isHearted: boolean,
    isFlagged: boolean,
}

export interface ITopic extends ParseObjectToJson  {
    name?: ILangString,
    slug?: string,
    imageUrl?: string,
}