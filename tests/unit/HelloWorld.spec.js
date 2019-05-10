import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import HelloWorld from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    // Arrange
    const msg = 'new message';
    const level = 42;

    // Act
    const wrapper = shallowMount(HelloWorld, {
      propsData: {
        msg,
        level,
      },
    });

    // Assert
    expect(wrapper.text()).to.include(msg);
    expect(wrapper.text()).to.include(level);
  });
});
