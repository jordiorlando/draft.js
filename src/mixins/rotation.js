Draft.mixins.rotation = {
  rotation: function(α, β, γ) {
    return this.prop({
      α: α,
      β: β,
      γ: γ
    });
  },

  rot: function() {
    return this.rotation(arguments);
  }
};
