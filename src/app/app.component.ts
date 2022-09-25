import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <mat-sidenav-container fullscreen autosize #container>
      <mat-sidenav
        mode="side"
        opened="true"
        #sidenav
        (appObserveResize)="container.updateContentMargins()"
      >
        <app-navigation></app-navigation>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar>
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
        </mat-toolbar>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class AppComponent {}
