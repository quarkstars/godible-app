import { ILangString } from "data/types";

export const resolveLangString = (langObject?: ILangString, lang?: string): [string|undefined, boolean] => {
    if (!langObject) return [undefined, false];
    if (lang) {
        let string = langObject[lang];
        if (string && string.length > 0) return [string, true];
    }
    let defaultLang = langObject.defaultLanguage || "english"
    return [langObject[defaultLang], false];
}