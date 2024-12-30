
const useParse = () => {
    /**
     * Updates a parse object
     */
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

    return {
        addParseObjectProperties,
    }
}

export default useParse