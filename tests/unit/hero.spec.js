import { expect } from 'chai';
import Hero from '@/business/hero';

describe('hero.js', () => {
  it('returns correct greeting message', () => {
    // Arrange
    const hero = new Hero('Mage', 10);

    // Act
    const result = hero.greet();

    // Assert
    expect(result).to.equal('Mage with level 10 says hello.');
  });
});
