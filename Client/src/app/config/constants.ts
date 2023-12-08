import { Injectable } from '@angular/core'

@Injectable()
export class Constants {
    public static readonly API_BASEURL: string = 'https://localhost:5001/api';
    public static readonly SITE_TITLE: string = 'Discussions';
}