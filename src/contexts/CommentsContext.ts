import { createContext } from 'react';

// This holds data that we'd be just prop drilling in the comments feature
export const CommentsContext = createContext<{
    commentingOn: any,
    setCommentingOn: Function,

    oldTopLevel: any,
    setOldTopLevel: Function

    topLevel: any,
    setTopLevel: Function,
}>({
    commentingOn: null,
    setCommentingOn: () => { },
    
    oldTopLevel: null,
    setOldTopLevel: () => {},

    topLevel: null,
    setTopLevel: () => {},
});

