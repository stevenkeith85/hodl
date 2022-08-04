import { createContext } from 'react';

// This holds data that we'd be just prop drilling in the comments feature
export const CommentsContext = createContext<{
    setCommentingOn: Function
}>({
    setCommentingOn: () => {}
});

