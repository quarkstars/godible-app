import { UserState } from 'components/AppShell';
import { language } from 'ionicons/icons';
import { IBook, IExactQuery } from '../data/types';
import React, {useContext, useState, useRef} from 'react'


//Construct useful strings based on episode data and append them to the episode


const useBooks = () => {
    const {
      language
    } = useContext(UserState);

    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [books, setBooks] = useState<IBook[]|undefined>();
    const [book, setBook] = useState<IBook|undefined>();

    


    //Gets episodes up to 24 at a time
    const getBooks = () => {

    }
    
    const getBook = (bookId?: string) => {

    }
    


    return {
        error,
        setError,
        isLoading,
        setIsLoading,

    }
}

export default useBooks