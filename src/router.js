import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from './layouts/Default.vue';
import About from './views/About.vue';
import Generate from './views/Generate.vue';
import Examples from './views/Examples.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '/about',
          name: 'about',
          component: About,
        },
        {
          path: '/',
          name: 'home',
          component: Generate,
        },
        {
          path: '/generate',
          name: 'generate',
          component: Generate,
        },
        {
          path: '/examples',
          name: 'examples',
          component: Examples,
        },
      ],
    },
  ],
});
