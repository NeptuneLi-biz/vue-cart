<template>
  <div>
    <Alert :sent-props="sentProps"></Alert>
    <Navbar></Navbar>
    <div class="container-fluid">
      <div class="row">
        <Sidebar></Sidebar>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Alert from '../AlertMessage';

export default {
  components: {
    Navbar,
    Sidebar,
    Alert,
  },
  data() {
    return {
      sentProps: {
        navHeight: 50,
      },
    };
  },
  mounted() {
    const vm = this;
    vm.sentProps.navHeight = document.querySelector('.navbar').offsetHeight;
  },
};
</script>
