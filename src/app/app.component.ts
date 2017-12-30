import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { element } from 'protractor';
import { NewsService } from './core/news.service';

const COMMAND_PROMPT_PREFIX = '>> ';
enum Command {
    News = 'news',
    Wikipedia = 'wikipedia'
}
const COMMANDS = [Command.News, Command.Wikipedia];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'dude';
    log = `I'm ready for your input`;
    command = new FormControl(COMMAND_PROMPT_PREFIX);
    suggestion: Observable<string>;
    constructor(private news: NewsService) {
        this.suggestion = this.command.valueChanges.map(input => this.getSuggestion(input));
    }

    commandKeyDown($event: KeyboardEvent) {
        if ($event.keyCode === 9) {
            this.command.setValue(this.getSuggestion(this.command.value));
            $event.preventDefault();
        } else if ($event.keyCode === 13) {
            this.executeCommand();
        }
    }
    private getSuggestion(input: string) {
        const suggstion = COMMANDS.find(com => com.indexOf(this.getRawCommand(input)) === 0);
        return suggstion ? COMMAND_PROMPT_PREFIX + suggstion : input;
    }
    private executeCommand() {
        switch (this.getRawCommand(this.command.value)) {
            case Command.News:
                this.log += `\nHere are some news biatch:`;
                this.news.getOverview().subscribe(articles =>
                    articles.map(a => {
                        const d = new Date(a.publishedAt);
                        const ds = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
                        this.appendToLog(`${ds}, ${a.author}: ${a.title}`);
                    })
                );
                break;
            case Command.Wikipedia:
                this.log += `\nSorry we're still working on that wikipedia integration`;
                break;
        }
    }
    /** Returns only the part after COMMAND_PROMPT_PREFIX. */
    private getRawCommand(command: string) {
        if (command.indexOf(COMMAND_PROMPT_PREFIX) === 0) {
            return command.substr(COMMAND_PROMPT_PREFIX.length);
        }
        return command;
    }
    private appendToLog(message: string) {
        this.log += `\n${message}`;
    }
}
