import Vue from 'vue'
import Router from 'vue-router'

import auth from '@/services/auth'

Vue.use(Router)

export default new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('@/components/Home'),
      beforeEnter: (to, from, next) => {
        if(auth.user.authenticated) {

        }

        return next()
      }
    },
    {
      path: '/parks',
      name: 'Parks',
      component: require('@/components/Parks/Parks'),
      // For Modals to display in <router-view>
      // children: [
      //   {
      //     path: 'import',
      //     name: 'Import',
      //     component: require('@/components/Parks/Import')
      //   }
      // ]
    },
    {
      path: '/kits',
      name: 'Kits',
      component: require('@/components/Kits/Kits'),
    },
    {
      path: '/parks/import',
      name: 'ImportPark',
      meta: { auth: true },
      component: require('@/components/Parks/Import')
    },
    {
      path: '/parks/:slug',
      name: 'Park',
      component: require('@/components/Parks/Park')
    },
    {
      path: '/my',
      name: 'Account',
      component: require('@/components/Account'),
      meta: { auth: true },
      children: [
        {
          path: 'account',
          name: 'MyAccount',
          meta: { auth: true },
          component: require('@/components/Account/My')
        },
        {
          path: '',
          name: 'MyWorld',
          meta: { auth: true },
          component: require('@/components/Account/My')
        }
      ]
    },
    {
      path: '/admin',
      name: 'Admin',
      component: require('@/components/Admin/Admin'),
      meta: { auth: true },
      children: [
        {
          path: 'permissions',
          name: 'Permissions',
          meta: { auth: true },
          component: require('@/components/Admin/Permissions')
        }
      ]
    },
    {
      path: '/by/:username',
      name: 'Profile',
      component: require('@/components/Profile/Profile')
    },
    {
      path: '/blueprints',
      name: 'Blueprints',
      component: require('@/components/Blueprints/Blueprints')
    },
    {
      path: '/blueprints/import',
      name: 'ImportBlueprint',
      meta: { auth: true },
      component: require('@/components/Blueprints/Import')
    },
    {
      path: '/billboards',
      name: 'Billboards',
      meta: { },
      component: require('@/components/Billboards/Billboards'),

    },
    {
      path: '/billboards/import',
      name: 'ImportBillboard',
      meta: { auth: true },
      component: require('@/components/Billboards/Import')
    },
    {
      path: '/billboards/convert-to-webm',
      name: 'Convert',
      meta: { auth: true },
      component: require('@/components/Billboards/Convert'),

    },
    // {
    //   path: '/billboards/generator',
    //   name: 'Generator',
    //   meta: { },
    //   component: require('@/components/Billboards/Generator'),
    // },
    {
      path: '/billboards/:slug',
      name: 'Billboard',
      component: require('@/components/Billboards/Billboard')
    },
    {
      path: '/blueprints/:slug',
      name: 'Blueprint',
      component: require('@/components/Blueprints/Blueprint')
    },
    {
      path: '/guides',
      name: 'Guides',
      component: require('@/components/Wiki/Wiki'),
      children: [
        {
          path: ':slug',
          name: 'GuidePage',
          component: require('@/components/Wiki/Page')
        }
      ]
    },
    {
      path: '/audio',
      name: 'Audio',
      component: require('@/components/Audio')
    },
    {
      path: '/help',
      name: 'Help',
      component: require('@/components/Help')
    },
  ]
})
