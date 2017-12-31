import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const API_KEY = '20c722848eaa48079eba479ffe3c27d7';
const API_BASE = 'https://newsapi.org/v2/';
const PATH_TOP_HEADLINES = 'top-headlines';
// top-headlines?sources=bbc-news&apiKey=20c722848eaa48079eba479ffe3c27d7

interface IArticle {
    author?: string;
    description?: string;
    publishedAt?: string;
    source: {
        id: string;
        name?: string;
    };
    title?: string;
    url?: string;
    urlToImage?: string;
}

interface ITopHeadlines {
    articles: IArticle[];
    status: string;
    totalResults: number;
}

@Injectable()
export class NewsService {
    constructor(private http: HttpClient) {}

    getOverview(): Observable<IArticle[]> {
        return this.http
            .get<ITopHeadlines>(API_BASE + PATH_TOP_HEADLINES, {
                params: {
                    apiKey: API_KEY,
                    sources: 'bbc-news'
                }
            })
            .map(result => result.articles);
    }
}
