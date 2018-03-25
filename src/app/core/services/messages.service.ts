import { Injectable } from '@angular/core';

@Injectable()
export class MessagesService {
    constructor() {}

    info(message: string) {
        console.log(message);
    }
}
