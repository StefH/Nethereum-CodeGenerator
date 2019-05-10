class Hero {
  constructor(name, level) {
    this.name = name;
    this.level = level;
  }

  greet() {
    return `${this.name} with level ${this.level} says hello.`;
  }
}

export default Hero;
