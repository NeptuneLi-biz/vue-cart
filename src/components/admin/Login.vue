<template>
  <div>
    <Alert :sent-props="sentProps"></Alert>
    <div class="wrap text-center mt-5">
      <form class="form-signin"
            @submit.prevent="signIn">
        <img class="d-inline-block align-self-center"
            src="./../../assets/images/logo.png"
            width="100" height="100" alt="">
        <h1 class="h3 mb-3 font-weight-normal">Neon Tattoo 後台管理</h1>
        <label for="inputEmail"
               class="sr-only">Email address</label>
        <input type="email"
               id="inputEmail"
               class="form-control"
               placeholder="Email address"
               v-model="user.username"
               required
               autofocus>
        <label for="inputPassword"
               class="sr-only">Password</label>
        <input type="password"
               id="inputPassword"
               class="form-control"
               placeholder="Password"
               v-model="user.password"
               required>
        <div class="checkbox mb-3">
          <label>
            <input type="checkbox"
                   value="remember-me"> Remember me
          </label>
        </div>
        <button class="btn btn-lg btn-primary btn-block"
                type="submit">Sign in</button>
        <p class="mt-5 mb-3 text-muted">
          Copyright © {{ author.year }} {{ author.name }}.All rights reserved.
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 40px 0;
}
.form-signin {
  width: 100%;
  max-width: 400px;
  padding: 15px;
  margin: auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type='email'] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type='password'] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>

<script>
import Alert from '../AlertMessage';

export default {
  components: {
    Alert,
  },
  name: 'Login',
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      sentProps: {
        navHeight: 0,
      },
      author: {
        name: 'NeptuneLi',
        year: new Date().getFullYear(),
      },
    };
  },
  methods: {
    signIn() {
      const api = `${process.env.API_PATH}/admin/signin`;
      const vm = this;
      this.$http.post(api, vm.user).then((response) => {
        if (response.data.success) {
          vm.$router.push('/admin/products');
          vm.$bus.$emit('message:push', response.data.message, 'success');
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
      });
    },
  },
  mounted() {
    document.body.setAttribute('style', 'background-color: #f5f5f5;');
  },
};
</script>
