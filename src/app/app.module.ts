import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { ExpansionViewportComponent } from "./expansion-viewport.component";
import {
  MatDrawerAutosizeHackDirective,
  MatSidenavAutosizeHackDirective,
} from "./autosize-hack.directive";
import { ObserveResizeDirective } from './observe-resize.directive';

@NgModule({
  declarations: [
    AppComponent,
    ExpansionViewportComponent,
    MatDrawerAutosizeHackDirective,
    MatSidenavAutosizeHackDirective,
    ObserveResizeDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
