# 0.2.0 (2016-02-05)
- `draft.proxy` will now only initialize nested props on set (configurable)
- `el.prop(prop)` now returns null if the property is undefined (used to set the property to the default from `draft.defaults`)
- add `draft.Point` element for `draft.Line` and `draft.Shape` to extend from
- remove `draft.types.opacity`
- add `draft.types.Float` and `draft.types.Length`
- remove `draft.px` and `unitHack()` and migrate to the new length class
- remove `el.width()` and `el.height()` from size mixin
- add `el.scale()` function for relative sizing
- update `draft.types.Color` to be a class akin to the other two types
- new types can be used with standard arithmetic operators (+-\*/) and should for the most part give sane results

# 0.1.0 (2016-02-02)
- add new `draft.Shape` element for primitives to extend from
- add support for fill and stroke, including color, opacity, and width
- add three new types/validators: unit, color, and opacity
- add support for nested properties via ES6 Proxies (e.g. `el.prop('fill.color')` will return `el._properties.fill.color`)

# 0.0.5 (2016-01-29)
- improve release process

# 0.0.4 (2016-01-29)
- improve release process

# 0.0.3 (2016-01-22)
- improve build process

# 0.0.2 (2016-01-21)
- improve build process

# 0.0.1 (2016-01-21)
- initial release
