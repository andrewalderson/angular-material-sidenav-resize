import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <mat-sidenav-container #container fullscreen>
      <mat-sidenav mode="side" opened="true" #sidenav appDrawerAutosizeHack>
        <app-expansion-viewport #viewport expanded="true">
          <mat-toolbar>
            <button
              mat-icon-button
              class="collapse-button"
              (click)="viewport.toggle()"
            >
              <mat-icon>chevron_left</mat-icon>
            </button>
          </mat-toolbar>
        </app-expansion-viewport>
      </mat-sidenav>
      <mat-toolbar>
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
      </mat-toolbar>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .collapse-button {
        margin-left: auto;
      }
    `,
  ],
})
export class AppComponent {}
