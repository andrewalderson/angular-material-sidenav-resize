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
        <app-collapsable-viewport
          #viewport
          [style.width]="viewport.collapsed ? '68px' : '256px'"
        >
          <mat-toolbar>
            <button
              mat-icon-button
              class="collapse-button"
              (click)="viewport.toggle()"
            >
              <mat-icon>chevron_left</mat-icon>
            </button>
          </mat-toolbar>
          <app-navigation [collapsed]="viewport.collapsed"></app-navigation>
        </app-collapsable-viewport>
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
  styles: [
    `
      .collapse-button {
        margin-left: auto;
      }
    `,
  ],
})
export class AppComponent {}
