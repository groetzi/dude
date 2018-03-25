import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // <-- #1 import module

import { AppComponent } from './app.component';
import { NewsService } from './core/services/news.service';
import { HttpClientModule } from '@angular/common/http';
import { ActionMenuComponent } from './shared/components/action-menu/action-menu.component';
import { UniverseService } from './core/services/universe.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MessagesService } from './core/services/messages.service';

@NgModule({
    declarations: [AppComponent, ActionMenuComponent],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NgxChartsModule
    ],
    providers: [NewsService, UniverseService, MessagesService],
    bootstrap: [AppComponent]
})
export class AppModule {}
