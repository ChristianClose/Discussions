import { Constants } from "../config/constants";

export class CommonHelpers {
    public static getLocalDateTime(dateTime: string): string {
        const postDate = new Date(dateTime);
        const offset = postDate.getTimezoneOffset() * 60000;

        return new Date(postDate.getTime() - offset).toLocaleString()
    }

    public static getApiUrl(endpoint: string): string {
        return `${Constants.API_BASEURL}/${endpoint}`;
    }
}

