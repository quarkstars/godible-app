import { ILangString } from "data/types";

export const resolveLangString = (langObject?: ILangString, lang?: string): string|undefined => {
    if (!langObject) return undefined;
    if (lang) {
        let string = langObject[lang];
        if (string && string.length > 0) return string;
    }
    let defaultLang = langObject.defaultLanguage || "english"
    return langObject[defaultLang];
}