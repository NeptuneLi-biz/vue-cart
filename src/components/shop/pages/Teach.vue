<template>
  <div>
    <div class="container my-5">
      <img v-for="i in 4" :key="i" class="w-100" :src="getManualPic(i)">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sentProps: {
      type: Object,
    },
  },
  methods: {
    getManualPic(i) {
      // eslint-disable-next-line
      return require(`../../../assets/images/manual/${i}.jpg`);
    },
  },
  created() {
    this.sentProps.isHome = false;
    window.scrollTo({
      top: 0,
      left: 0,
    });
  },
};
</script>
