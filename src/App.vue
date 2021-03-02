<template>
  <div id="app"><app-navigation />
    <div class="ui container">
      <!-- <img src="./assets/logo.png" /> -->
      
      <router-view />
    </div>
  </div>
</template>

<script>
import Navigation from './components/Navigation';

export default {
  name: 'App',
  components: {
    'app-navigation': Navigation,
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

label{
  margin:1rem!;
}

.mp{
  margin-bottom:1rem;
  margin-top:.5rem;
}
</style>
