export interface PostComment {
    id: number;
    comment: string;
    userName: string;
    date: string;
    parentCommentId: number;
    children: Array<childrenComments>;
}

type childrenComments = {
    id: number;
    comment: string;
    userName: string;
    date: string;
    parentCommentId: number;
}