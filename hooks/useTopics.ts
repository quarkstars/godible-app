import { language } from 'ionicons/icons';
import { ITopic, IExactQuery, IGetObjectOptions } from '../data/types';
import React, {useContext, useState, useRef, useEffect} from 'react'
import { UserState } from 'components/UserStateProvider';
import { userDefaultLanguage } from 'data/translations';
import { resolveLangString } from 'utils/resolveLangString';


//Construct useful strings based on episode data and append them to the episode


const useTopics = () => {
    const {
      user
    } = useContext(UserState);

    const [error, setError] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [topics, setTopics] = useState<ITopic[]|undefined>();


    const getTopicOptions = useRef <IGetObjectOptions|undefined>();


    const getTopics = async (topicIds?: string[], _options?: IGetObjectOptions, isAppending = false) => {
        setIsLoading(true);
        try {
            let options = _options || getTopicOptions.current;
            getTopicOptions.current = { ...getTopicOptions.current, ...options};
            const limit = options?.limit || 24;
            const skip = options?.skip || 0;
            const params = {
              topicIds,
              options,
              limit,
              skip,
            }
            const results = await Parse.Cloud.run("getTopics", params);
            let newTopics = results.map((topic: any) => {
                // const jsonEpisode = episode.toJSON();
                return appendTopicStrings(topic);
            });
            if (isAppending && topics) {
                setTopics(prev => [...prev!, ...newTopics]);
            } else {
                setTopics(newTopics);
            }
            setError(undefined);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const appendTopicStrings = (topic: ITopic): ITopic => {
        const _lang = (user?.language) ? user?.language : userDefaultLanguage;

        const _name = resolveLangString(topic?.name, _lang);
        //console.log('getEpisodes', getEpisodes())

        return {
            ...topic,
            _name,
        };
    }

    //When the user changes their language, if episodes exists, redo the episode setrings
    useEffect(() => {
        if (!user.language || !topics) return;
        setTopics((prevEpisodes) => {
            return prevEpisodes?.map((topic: any) => {
                return appendTopicStrings(topic);
            })
        });

      }, [user.language]);


    return {
        error,
        setError,
        isLoading,
        setIsLoading,
        getTopics,
        topics,
        skip: getTopicOptions.current?.skip
    }
}

export default useTopics