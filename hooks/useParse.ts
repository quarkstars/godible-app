import { IExactQuery } from './../data/types';
import React from 'react'

const useParse = () => {
    const addParseObjectProperties = (parseObject: Parse.Object, updates: any) => {
        let updatedObject = parseObject;
        for (const key in updates) {
            if (Object.hasOwnProperty.call(updates, key)) {
                const value = updates[key];
                if (typeof value === "undefined") continue;
                updatedObject.set(key, value);
            }
        }
        return updatedObject;
    }

    const getParseAndQuery = (query: IExactQuery) => {
        
    }

    return {
        addParseObjectProperties,
    }
}

export default useParse