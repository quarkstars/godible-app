export interface ParseObjectToJson {
    objectId?: string,
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    createdTime?: number;
    updatedTime?: number;
    className?: string;
    ACL?: any,
    __type?: string,
}

export interface IUser extends ParseObjectToJson {

    language?: string, //Can exist when the user is not logged in
    fontSize?: string, //small, normal, large
    fontContrast?: string, //light, normal, strong
    fontStyle?: string, //serif, sanserif

    //Simple list of all pointers
    lists?: IList[],
    savedListId?: string,

    email?: string,
    imageUrl?: string,
    firstName?: string,
    lastName?: string,

    // //
    // heartCount?: number,
    // flagCount?: number,

    
    currentStreak?: number,
    maxStreak?: number,
}

export interface IList extends ParseObjectToJson {
    name?: string,
    userId?: string,
    episodes: IEpisode[],
    slug?: string, //This would be book slug+speech name
    textHighlighted?: string,

    // If came from a speech, the metaData will be added here. 
    description?: string,
    
    //Perhaps used if the user can share it
    // isPublic?: boolean,

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
    topics?: ITopic[],
    isFreeSample?: boolean,
    position?: IListeningPosition,
    textHighlighted?: string,
    hitCount?: number,
    // duration?: number,

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
    _audioPath?: string,


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
    episodeCount?: number,
    speechCount?: number,
}

export interface ISpeech extends IList {
    title?: ILangString,
    hitCount?: number,
    textHiglighted?: string,
    // book?: IBook, 
    metaData?: ILangString,
    //If the speech is only available in a certain language
    language?: string,
}

export interface IListening extends ParseObjectToJson {
    date?: string,
    month?: string,
    userId?: string,
    hasValidSession?: boolean, //If true, session shows
    positions: IListeningPosition[],
}

export interface IListeningPosition extends ParseObjectToJson {
    episode?: IEpisode,
    isComplete?: boolean,
    isValidSession?: boolean,
    seconds?: number,
    listId?: string,
    index?: number,
    updatedTime?: number,
    createdTime?: number, 
    progress?: number,
    // duration?: number,
 }

export interface INote extends ParseObjectToJson {
    episode?: IEpisode, //name, slug, number, image
    episodeId?: string, 
    isPublic?: boolean,
    text?: string,
    userId?: string,
    user?: IUser,
    flagCount?: number,
    heartCount?: number,
    //Appended when delivered to client
    isHearted?: boolean,
    isFlagged?: boolean,
}

//TODO: Is this necessary to have on the client?
export interface INoteFeedback extends ParseObjectToJson {
    userId?: string,
    noteId?: string,
    report?: string,
    isHearted?: boolean|null,
    isFlagged?: boolean|null,
}

export interface ITopic extends ParseObjectToJson  {
    name?: ILangString,
    slug?: string,
    imageUrl?: string,
    _name?: string,
    episodeCount?: number,
    speechCount?: number,
}

export interface IGetObjectOptions {
    limit?: number,
    skip?: number
    sort?: string, //Must be preceeded by either - or + (descending or ascending)
    userId?: string,
    isPublic?: boolean,
    include?: string[],
    exclude?: string[],
    slug?: string,
}


export interface IDateMap {
    [date: string]: IDate,
}
export interface IDate {
    listenings?: IListening[],
    notes?: INote[],
}