# v0.0.0

- Decide on document model:
  - Draft.Doc is top level, one document
  - One doc can contain multiple views (same as pages?)
  - One doc contains one model, which can be viewed in different ways? Or multiple models, each of which can be viewed in multiple ways?
  - Get rid of Draft.Page, and use a new Model container instead? Or just use groups?
  - Allow for custom elements with custom parameters. Basically a new element class that can be instantiated just like the core ones, but can contain pre-defined geometries or groups.

- Configurable coordinate systems (units, size, origin)
- 2D primitives (point, line, rect, square?, ellipse, circle?)
- Relative transformations (translate, rotate, skew, scale)
- Basic styling (fill, stroke, etc)
- 2D output to SVG

# v1.0.0

- Rewrite with ES6 features (classes, template strings, arrow functions, promises, etc) via Babel?
- Layers
- Matrix transformations

# v2.0.0

- 2D boolean operations (masks, clips)
- Complex SVG features (text, images, paths)
- Animations

# v3.0.0

- 3D rendering via OpenGL/canvas
- 3D primitives (box/cuboid, cube?, cylinder, sphere)
- 3D functions (hull, minkowski, CSG)
- 3D output to (OpenSCAD?)
