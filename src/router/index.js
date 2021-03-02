import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/Login';
import NewTicket from '@/pages/NewTicket';
import MyTickets from '@/pages/MyTickets';
import AllTickets from '@/pages/AllTickets';
import Ticket from '@/pages/Ticket';
import TicketSubmit from '@/pages/TicketSubmit';
import firebase from 'firebase';

Vue.use(Router);

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'newticket',
      component: NewTicket,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/mytickets',
      name: 'mytickets',
      component: MyTickets,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/alltickets',
      name: 'alltickets',
      component: AllTickets,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/ticket/:id',
      name: 'Ticket',
      component: Ticket,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/ticketsubmit/:id',
      name: 'TicketSubmit',
      component: TicketSubmit,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    // {
    //   path: '/',
    //   name: 'collect',
    //   component: Collect,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresGuest: true,
      },
    },
    // {
    //   path: '/collect',
    //   name: 'collect',
    //   component: Collect,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/rawdata',
    //   name: 'rawData',
    //   component: RawData,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: Dashboard,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/deploy',
    //   name: 'deploy',
    //   component: Deploy,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/covidinventory',
    //   name: 'covidinventory',
    //   component: CovidInventory,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
    // {
    //   path: '/covidrawdata',
    //   name: 'covidrawdata',
    //   component: CovidRawData,
    //   meta: {
    //     requiresAuth: true,
    //   },
    // },
  ],
});
//Navigation Guards
router.beforeEach((to, from, next) => {
  //Check Auth
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //Check if not logged in
    if (!firebase.auth().currentUser) {
      //Go to Login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      //procedd to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    //Check if logged in
    if (firebase.auth().currentUser) {
      //Go to Collection Page
      next({
        path: '/',
        query: {
          redirect: to.fullPath,
        },
      });
    } else {
      //procedd to route
      next();
    }
  } else {
    next();
  }
});

export default router;
