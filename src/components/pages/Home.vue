<template>
  <div id="templateHome">
    <swiper class="container-fluid p-0 swiper" :options="swiperOption">
      <swiper-slide v-for="i in 2" :key="i">
        <img class="w-100" :src="getBanner(i)">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
    <div class="container" style="height:1000px; background-color: lightpink;"></div>
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
      return require(`../../assets/images/banner/${i}.jpg`);
    },
  },
  created() {
    this.sentProps.isHome = true;
    window.document.documentElement.scrollTop = 0;
  },
  mounted() {
    // fix nav height
    const navHeight = document.querySelector('.navbar').offsetHeight.toString();
    document.querySelector('#templateHome').setAttribute('style', `margin-top: -${navHeight}px;`);
  },
};
</script>
