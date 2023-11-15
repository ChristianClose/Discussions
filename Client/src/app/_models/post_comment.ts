export interface PostComment {
    id: number;
    comment: string;
    userName: string;
    date: string;
    parentCommentId: number;
    children: Array<PostComment>;
}

type childrenComments = {
    id: number;
    comment: string;
    userName: string;
    date: string;
    parentCommentId: number;
}