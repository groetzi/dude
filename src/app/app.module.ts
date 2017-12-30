import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // <-- #1 import module

import { AppComponent } from './app.component';
import { NewsService } from './core/news.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule],
    providers: [NewsService],
    bootstrap: [AppComponent]
})
export class AppModule {}
