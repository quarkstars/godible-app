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
}

export interface IList extends ParseObjectToJson {
    name?: string,
    user?: IUser,
    episodes: IEpisode[],
    
    //public list for speeches
    isPublic?: boolean,

    //Do I need this to make a relation?
    // "__type"?: "Pointer", 
    // className?: "List"
}

export interface IEpisode  extends ParseObjectToJson {
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
    searchText?: string,
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

export interface IBook extends ParseObjectToJson{
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
    slug: string, //This would be book slug+speech name
    book: IBook,
    startIndex: number,
    endIndex: number,
}