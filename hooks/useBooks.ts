import { language } from 'ionicons/icons';
import { IBook, IExactQuery, IGetObjectOptions } from '../data/types';
import React, {useContext, useState, useRef} from 'react'
// import { UserState } from 'components/UserstateProvider';


//Construct useful strings based on episode data and append them to the episode


const useBooks = () => {
    // const {
    //   language
    // } = useContext(UserState);

    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [books, setBooks] = useState<IBook[]|undefined>();


    const getBookOptions = useRef <IGetObjectOptions|undefined>();


    const getBooks = async (bookIds?: string[], _options?: IGetObjectOptions, isAppending=false) => {
        setIsLoading(true);
        try {
            let options = _options || getBookOptions.current;
            getBookOptions.current = { ...getBookOptions.current, ...options};
            const limit = options?.limit || 24;
            const skip = options?.skip || 0;
            const params = {
              bookIds,
              options,
              limit,
              skip,
            }
            const results = await Parse.Cloud.run("getBooks", params);
            if (isAppending && books) {
                setBooks((prev) =>{ return [...prev!, ...results]});
            } else {
                setBooks(results);
            }
            setError(undefined);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };
    


    return {
        error,
        setError,
        isLoading,
        setIsLoading,
        getBooks,
        books,
        setBooks,
        skip: getBookOptions.current?.skip
    }
}

export default useBooks