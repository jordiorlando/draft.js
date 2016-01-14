Draft.mixins.rotation = {
  rotation: function(α, β, γ) {
    return this.prop({
      α: α,
      β: β,
      γ: γ
    });
  },

  rot(...args) {
    return this.rotation(...args);
  },

  rotate: function(α, β, γ) {
    α = this.prop('α') + α || 0;
    β = this.prop('β') + β || 0;
    γ = this.prop('γ') + γ || 0;

    return this.position(α, β, γ);
  }
};
