Draft.transform = {
  transform: function (obj) {
    // TODO: make this work with actual transformation matrices
    for (var k in obj) {
      obj[k] = obj[k] == null ?
        obj[k] : this.prop(k) + obj[k];
    }

    return this.prop(obj);
  }
};
