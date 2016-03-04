describe('Element', function() {
  var element;
  var type = 'element';
  var name = 'test';

  beforeEach(function() {
    jasmine.addMatchers({
      toHave: function(util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            var result = {};

            result.pass = expected in actual;

            result.message = `Expected ${actual}${result.pass ?
              ' not' : ''} to have ${expected}`;

            return result;
          }
        };
      }
    });

    element = new draft.Element(name);
  });

  describe('type', function() {
    it('should be the correct element type', function() {
      expect(element.type).toEqual(type);
    });
  });

  describe('id', function() {
    it('should be undefined when instantiated independently', function() {
      expect(element.id).toBeUndefined();
    });
  });

  describe('name', function() {
    it('should be named when instantiated with a name', function() {
      expect(element.meta.name).toEqual(name);
    });
  });

  describe('domID', function() {
    it('should be a correctly formatted identifier string', function() {
      var length = 4;
      var id = Math.round(Math.random() * parseInt('9'.repeat(length)));
      var regex = `^${type}_0{${Math.max(length - String(id).length, 0)}}${id}$`;

      element._id = id;
      expect(element.domID).toMatch(regex);
    });
  });

  describe('meta', function() {
    it('should contain the element\'s name', function() {
      expect(element.meta).toHave('name');
    });
  });

  describe('prop(prop, val)', function() {
    var properties = {
      foo: 'hello',
      bar: {
        baz: 'world'
      }
    };

    describe('when prop is undefined', function() {
      it('should get all properties', function() {
        element._properties = properties;
        expect(element.prop()).toEqual(properties);
      });
    });

    describe('when prop is null', function() {
      it('should delete all properties', function() {
        element._properties = properties;
        element.prop(null);
        expect(element._properties).toEqual({});
      });
    });

    describe('when prop is a string', function() {
      var prop = 'foo';
      var val = 'bar';

      it('should set a single property when val is a string', function() {
        element.prop(prop, val);
        expect(element._properties[prop]).toEqual(val);
      });

      it('should get a single property when val is undefined', function() {
        element._properties[prop] = val;
        expect(element.prop(prop)).toEqual(val);
      });

      it('should delete a single property when val is null', function() {
        element.prop(prop, null);
        expect(element._properties).not.toHave(prop);
      });

      it('should return null when a property doesn\'t exist', function() {
        delete element._properties[prop];
        expect(element.prop(prop)).toBeNull();
      });
    });

    /* describe('when prop is an Object', function() {
      it('should set all the corresponding properties in prop', function() {

      });
    }); */
  });
});
