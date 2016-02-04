# v1.0.0

- [x] Cartesian coordinate system
- [ ] 2D primitives (point, line, rect, square?, ellipse?, circle)
- [ ] Relative transformations (translate, rotate, scale, skew)
- [ ] Matrix transformations
- [ ] Decide on document model:
  - draft.Doc is top level, one document
  - One Doc contains multiple Models, each of which can have multiple Views
  - Make draft.Page extend draft.View and move it into a plugin
  - Use a new Model container (or just Groups) instead of draft.Page
  - Allow for custom elements with custom parameters. Basically a new element class that can be instantiated just like the core ones, but can contain pre-defined geometries or groups.

## Plugins

- [x] draft-svg
  - 2D rendering via SVG
- [ ] draft-canvas
  - 2D/3D rendering via canvas
- [ ] draft-page?
  - 2D page view (with layers?)
  - Basic styling (fill, stroke, etc)
- [x] draft-treeview
  - For development/developers

# v2.0.0

- [ ] 2D boolean operations (masks, clips)
- [ ] Complex SVG features (text, images, paths)
- [ ] Configurable coordinate systems (polar, cylindrical, spherical)
- [ ] Animations

# v3.0.0

- [ ] 3D rendering via OpenGL/canvas
- [ ] 3D primitives (box/cuboid, cube?, cylinder, sphere)
- [ ] 3D functions (hull, minkowski, CSG)
- [ ] 3D output to (OpenSCAD?)
