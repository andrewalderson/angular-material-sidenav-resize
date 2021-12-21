# Angular Material Sidenav Resize

This is a sample of how to add an animation when changing the width of the Material Sidenav or Drawer components.
Currently this functionality is not supported. The 'autosize' functionality of the container component only
supports resizing without an animation.

This smaple uses an inner viewport component that encapsulates the resizing and width animation and
a directive that handles modifying the drawer to make this work.

NOTE: In this sample the 'autosize' property on the drawer container is not set becuase it is superflous
with this directive. Once the drawer supports animating the resize this directive can be removed and
the autosize property can be used instead.
