import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesModule } from './pages/categories/categories.module';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api'
import { InMemoryDatabase } from './pages/in-memory-database';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
  ],
  exports: [
    CategoriesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
