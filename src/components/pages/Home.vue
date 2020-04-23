<template>
  <div id="templateHome">
    <swiper class="swiper" :options="swiperOption">
      <swiper-slide><img class="w-100" src="./../../assets/images/1.jpg" alt=""></swiper-slide>
      <swiper-slide><img class="w-100" src="./../../assets/images/2.jpg" alt=""></swiper-slide>
      <swiper-slide><img class="w-100" src="./../../assets/images/3.jpg" alt=""></swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
    <div class="test" style="height:400px; background-color: lightpink;"></div>
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
import $ from 'jquery';
import shopSidebar from '../ShopSidebar';

export default {
  components: {
    shopSidebar,
  },
  data() {
    return {
      // categories: ['商品分類', '最新商品', '精選推薦'],
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
      products: {},
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
    openAside(open) {
      if (open) {
        $('body').addClass('open');
        $('.bg-color').addClass('modal-backdrop fade show');
      } else {
        $('body').removeClass('open');
        $('.bg-color').removeClass('modal-backdrop fade show');
      }
    },
    getProducts() {
      const vm = this;
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/products`;
      this.$http.get(api).then((response) => {
        vm.products = response.data.products;
        vm.products.forEach((item) => {
          if (item.category) {
            vm.categories[0].subcategories.push(item.category);
          }
        });
        vm.categories[0].subcategories = [...(new Set(vm.categories[0].subcategories))];
      });
    },
  },
  created() {
    $(window).scroll(() => {
      if (window.scrollY > 100) {
        $('.navbar').addClass('solid bg-primary');
      } else {
        $('.navbar').removeClass('solid bg-primary');
      }
    });
    this.getProducts();
  },
  mounted() {
    // fix nav height
    const navHeight = document.querySelector('.navbar').offsetHeight.toString();
    document.querySelector('#templateHome').setAttribute('style', `margin-top: -${navHeight}px;`);
  },
};
</script>
