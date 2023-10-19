import { PostComment } from "./post_comment";

export interface Post {
    id: number;
    title: string;
    message: string;
    date: string;
    userName: string;
    comments: Array<PostComment>;
}