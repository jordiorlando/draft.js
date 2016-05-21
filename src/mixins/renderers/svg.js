// TODO: use draft.WeakMap
let _svg = new WeakMap();
let _maxWidth = new WeakMap();
let _maxHeight = new WeakMap();

draft.mixins.svg = {
  svg(width, height) {
    width = width ? draft.newLength(width) : _maxWidth.get(this);
    height = height ? draft.newLength(height) : _maxHeight.get(this);

    var calcX = function(element) {
      return (element.prop('x') || 0) - element.prop('width') / 2;
    };
    var calcY = function(element) {
      return -(element.prop('y') || 0) - element.prop('height') / 2;
    };

    var domPrefix = `${this.doc.domID}:${this.domID}:svg`;
    var domID = function(element) {
      return `${domPrefix}:${element.domID}`;
    };

    _maxWidth.set(this, width || this.prop('width'));
    _maxHeight.set(this, height || this.prop('height'));

    if (!_svg.has(this)) {
      const NS = 'http://www.w3.org/2000/svg';
      // const XMLNS = 'http://www.w3.org/2000/xmlns/';
      // const XLINK = 'http://www.w3.org/1999/xlink';
      const VERSION = '1.1';

      var render = function(element) {
        // console.info('rendering svg:', element.domID);

        // TODO: separate listener for each property?
        var node, listener;
        var type = element.type;
        var create = svgType => document.createElementNS(NS, svgType);

        if (element instanceof draft.Group) {
          node = create('g');

          let renderChild = function(child) {
            let childNode = render(child);
            if (childNode) {
              node.appendChild(childNode);
            }
          };

          for (let child of element.children) {
            renderChild(child);
          }

          element.on('add', renderChild);

          element.on('remove', function(child) {
            node.removeChild(document.getElementByID(domID(child)));
          });

          type = 'group';
        }

        switch (type) {
          case 'line':
            node = create('line');

            listener = function(prop, val) {
              var size;

              switch (prop) {
                case 'y':
                  val *= -1;
                  size = 0;
                  break;
                case 'width':
                  val = this.target.prop('x');
                  // Falls through
                case 'x':
                  prop = 'x';
                  size = this.target.prop('width') / 2;
                  break;
                default:
                  return;
              }

              node.setAttribute(`${prop}1`, val - size);
              node.setAttribute(`${prop}2`, val + size);
            };

            break;
          case 'group':
          case 'rectangle':
            node = node || create('rect');

            listener = function(prop, val) {
              var link;

              switch (prop) {
                case 'width':
                  link = 'x';
                  // Falls through
                case 'height':
                  link = link || 'y';
                  listener.call(this, link, this.target.prop(link));
                  break;
                case 'y':
                  link = 'height';
                  val *= -1;
                  // Falls through
                case 'x':
                  link = link || 'width';
                  val -= this.target.prop(link) / 2;
                  break;
                default:
                  return;
              }

              node.setAttribute(prop, val);
            };

            break;
          case 'square':
            node = node || create('rect');

            listener = function(prop, val) {
              switch (prop) {
                case 'width':
                  node.setAttribute('height', val);

                  for (let link of ['x', 'y']) {
                    listener.call(this, link, this.target.prop(link));
                  }

                  break;
                case 'y':
                  val *= -1;
                  // Falls through
                case 'x':
                  val -= this.target.prop('width') / 2;
                  break;
                default:
                  return;
              }

              node.setAttribute(prop, val);
            };

            break;
          case 'ellipse':
            node = create('ellipse');

            listener = function(prop, val) {
              switch (prop) {
                case 'width':
                  prop = 'rx';
                  val.value /= 2;
                  break;
                case 'height':
                  prop = 'ry';
                  val.value /= 2;
                  break;
                case 'y':
                  val.value *= -1;
                  // Falls through
                case 'x':
                  prop = `c${prop}`;
                  break;
                default:
                  return;
              }

              node.setAttribute(prop, val);
            };

            break;
          case 'circle':
            node = create('circle');

            listener = function(prop, val) {
              switch (prop) {
                case 'diameter':
                case 'width':
                  prop = 'r';
                  val.value /= 2;
                  break;
                case 'y':
                  val.value *= -1;
                  // Falls through
                case 'x':
                  prop = `c${prop}`;
                  break;
                default:
                  return;
              }

              node.setAttribute(prop, val);
            };

            break;
          default:
            return;
        }

        // TODO: support all elements
        node.id = domID(element);

        let hasStyle = [];
        for (let style of ['fill', 'stroke']) {
          if (style in element) {
            hasStyle.push(style);
          }
        }

        if (hasStyle.length) {
          let styleListener = function(prop, val) {
            prop = prop.replace('.color', '').replace('.', '-');

            var color = /^(fill|stroke)(-opacity)?$/;
            var stroke = /^stroke-(width)?$/;

            if (color.test(prop) || stroke.test(prop)) {
              node.setAttribute(prop, val);
            }
          };

          for (let style of hasStyle) {
            for (let prop of ['color', 'opacity', 'width']) {
              prop = `${style}.${prop}`;
              let val = element.prop(prop) || draft.defaults[prop];

              styleListener(prop, val);
            }
          }

          element.on('change', styleListener);
        }

        for (let prop in element.prop()) {
          listener.apply({target: element}, [prop, element.prop(prop)]);
        }

        element.on('change', listener);

        node.addEventListener('click', function() {
          element.fire('click');
        });

        return node;
      };

      var svg = document.createElementNS(NS, 'svg');
      _svg.set(this, svg);
      svg.setAttribute('xmlns', NS);
      svg.setAttribute('version', VERSION);
      // svg.setAttributeNS(XMLNS, 'xmlns:xlink', XLINK);

      svg.id = domID(this);

      var listener = function(prop) {
        if (prop === 'width' || prop === 'height') {
          let targetWidth = this.target.prop('width');
          let targetHeight = this.target.prop('height');

          // 1 SVG user unit = 1px
          svg.setAttribute('viewBox', [
            calcX(this.target), calcY(this.target),
            targetWidth, targetHeight
          ].map(val => val.valueOf()).join(' '));

          let zoom = Math.min(
            _maxWidth.get(this.target) / targetWidth,
            _maxHeight.get(this.target) / targetHeight
          );

          let svgWidth = targetWidth * zoom;
          let svgHeight = targetHeight * zoom;

          _svg.get(this.target).setAttribute('width', svgWidth);
          _svg.get(this.target).setAttribute('height', svgHeight);

          // console.info('aspect ratio:', this.target.aspectRatio);
        }
      };

      listener.apply({target: this}, ['width']);
      listener.apply({target: this}, ['height']);

      this.on('change', listener);

      svg.appendChild(render(this.parent));
    }

    return _svg.get(this);
  }
};
