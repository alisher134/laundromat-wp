class Spring {
  constructor(config) {
    this.stiffness = config.stiffness;
    this.damping = config.damping;
    this.mass = config.mass;
    this.velocity = 0;
    this.current = 0;
    this.target = 0;
  }

  update(deltaTime) {
    const deltaTimeSeconds = deltaTime / 1000;
    const force = (this.target - this.current) * this.stiffness;
    const damping = this.velocity * this.damping;
    const acceleration = (force - damping) / this.mass;
    
    this.velocity += acceleration * deltaTimeSeconds;
    this.current += this.velocity * deltaTimeSeconds;
    
    if (Math.abs(this.target - this.current) < 0.001 && Math.abs(this.velocity) < 0.001) {
      this.current = this.target;
      this.velocity = 0;
    }
    
    return this.current;
  }

  setTarget(value) {
    this.target = value;
  }

  getValue() {
    return this.current;
  }
}
