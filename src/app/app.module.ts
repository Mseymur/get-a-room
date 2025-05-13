import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {AuthInterceptor} from './interceptors/auth.interceptor';

@NgModule({ 
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], 
    imports: [
        MbscModule,
        FormsModule,
        BrowserModule,
        IonicModule.forRoot({
            mode: 'md'
        }),
        AppRoutingModule
    ], 
    providers: [
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
    ]
})
export class AppModule {
}
