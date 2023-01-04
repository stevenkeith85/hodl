import { createContext } from 'react';

// This holds data that we'd be just prop drilling in the comments feature
export const CommentsContext = createContext<{
    commentingOn: any,
    setCommentingOn: Function,

    oldTopLevel: any,
    setOldTopLevel: Function

    topLevel: any,
    setTopLevel: Function,

    fullscreen: any,
    setFullscreen: Function,

    limit?: any
}>({
    commentingOn: null,
    setCommentingOn: () => { },
    
    oldTopLevel: null,
    setOldTopLevel: () => {},

    topLevel: null,
    setTopLevel: () => {},

    fullscreen: false,
    setFullscreen: () => {},

    limit: null
});

