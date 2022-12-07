# Angular Material Sidenav Resize

[Demo](https://andrewalderson.github.io/angular-material-sidenav-resize)

This is a sample of how to add an animation when changing the width of the Material Sidenav or Drawer components.
Currently this functionality is not supported. The 'autosize' functionality of the container component only
supports resizing without an animation. The problem with the current implementation 
is that class added to the container ('mat-drawer-transition') to handle the animations interferes with proper 
adjustment of the container margins and causes the updating of the margins to lag behind the updating of the 
with of the drawer.

This sample uses a directive that handles removing the 'mat-drawer-transition' class
after the animations are completed. It also adds a directive that encapsulates
observing the resize of the drawer and updating the containers content margins.
It also uses an internal 'viewport' component that encapsulates the animations
for resizing the width of the drawer. We are not actually resizing the drawer but this internal component.
The drawer is set to be the width of this internal 'viewport'.
