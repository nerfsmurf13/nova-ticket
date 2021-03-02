<template>
<div class="ui message" :class="color">{{message}}</div>
</template>

<script>
export default {
  data() {
    return {
      
    };
  },
  props:{
    message: '',
      color: '',
  }
};
</script>

<style></style>
