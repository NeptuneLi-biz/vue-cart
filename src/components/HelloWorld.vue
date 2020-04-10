<template>
  <div class="hello">
    <a href="#" @click.prevent="signout">登出</a>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  methods: {
    signout() {
      const api = `${process.env.API_PATH}/logout`;
      const vm = this;
      this.$http.post(api, vm.user).then((response) => {
        // eslint-disable-next-line
        console.log(response.data);
        if (response.data.success) {
          vm.$router.push('/login');
        }
      });
    },
  },
};
</script>
