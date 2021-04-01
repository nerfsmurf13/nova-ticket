import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/Login';
import NewTicket from '@/pages/NewTicket';
import MyTickets from '@/pages/MyTickets';
import AllTickets from '@/pages/AllTickets';
import Devices from '@/pages/Devices';
import AddDevices from '@/pages/AddDevices';
import AllInventory from '@/pages/AllInventory';
import AllContainers from '@/pages/AllContainers';
import AddRoom from '@/pages/AddRoom';
import Rooms from '@/pages/Rooms';
import AddStudents from '@/pages/AddStudents';
import AddContainer from '@/pages/AddContainer';
import Container from '@/pages/Container';
import Students from '@/pages/Students';
import Ticket from '@/pages/Ticket';
import Device from '@/pages/Device';
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
        requiresAuth: false,
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
      path: '/device/:id',
      name: 'Device',
      component: Device,
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
        requiresAuth: false,
      },
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: AllInventory,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/devices',
      name: 'Devices',
      component: Devices,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/adddevices',
      name: 'addDevices',
      component: AddDevices,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/students',
      name: 'students',
      component: Students,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/addstudents',
      name: 'addstudents',
      component: AddStudents,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/addcontainer',
      name: 'addcontainer',
      component: AddContainer,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/containers',
      name: 'containers',
      component: AllContainers,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/container/:id',
      name: 'container',
      component: Container,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: Rooms,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/addroom',
      name: 'addroom',
      component: AddRoom,
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
