<template>
  <div id="templateHome">
    <loading :active.sync="sentProps.isLoading"></loading>
    <swiper class="container-fluid p-0 swiper" :options="swiperOption">
      <swiper-slide v-for="i in 2" :key="i">
        <img class="w-100" :src="getBanner(i)">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
    <div class="container">
      <router-link v-for="i in 7" :key="i"
                  :to="`/shop/${link[i-1]}`"
                  @click.native="sentProps.category = link[i-1]">
        <img class="w-100" :src="getHomePic(i)">
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .dropdown:hover .dropdown-menu {
    display: block;
    top: 90%;
  }
  .navbar {
    transition: background-color 1s ease 0s;
  }
  .bg-color {
    transition: all .3s;
  }
</style>

<script>
export default {
  props: {
    sentProps: {
      type: Object,
    },
  },
  data() {
    return {
      categories: [
        {
          title: '商品分類',
          subcategories: [],
        },
        {
          title: '全部商品',
          subcategories: [],
        },
        {
          title: '精選推薦',
          subcategories: [],
        },
      ],
      link: [
        '',
        '',
        '全臂式刺青貼',
        '滿背刺青貼',
        '半甲刺青貼',
        '大圖刺青貼',
        '小圖刺青貼',
      ],
      swiperOption: {
        autoplay: {
          disableOnInteraction: false,
          delay: 3000,
        },
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    };
  },
  methods: {
    getBanner(i) {
      // eslint-disable-next-line
      return require(`../../../assets/images/banner/${i}.jpg`);
    },
    getHomePic(i) {
      // eslint-disable-next-line
      return require(`../../../assets/images/home/${i}.jpg`);
    },
  },
  created() {
    this.sentProps.isHome = true;
    window.document.documentElement.scrollTop = 0;
  },
  mounted() {
    // fix nav height
    const vm = this;
    vm.sentProps.navHeight = document.querySelector('.navbar').offsetHeight;
    document.getElementById('templateHome').setAttribute('style', `margin-top: -${vm.sentProps.navHeight}px;`);
  },
};
</script>
