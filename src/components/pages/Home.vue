<template>
  <div>
    <main>
      <nav class="navbar navbar-expand-lg navbar-dark text-white fixed-top">
        <!-- <button class="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarNavDropdown"
         aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation"> -->
        <button class="navbar-toggler mobile-link" type="button" data-toggle="collapse"
              @click="openAside(true)">
          <span class="navbar-toggler-icon"></span>
        </button>
        <router-link class="navbar-brand text-light d-flex" to="/home">
          <img class="d-inline-block align-self-center"
              src="./../../assets/images/logo.png"
              width="50" height="50" alt="">
          <div class="d-inline-block align-self-center ml-2">Neon Tattoo</div>
        </router-link>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item"
                v-for="(item) in categories" :key="item.title"
                :class="{'dropdown': item.subcategories.length !== 0}">
              <!-- NOTE: 之後是用 routerLink ,所以現在沒 preventDefault 沒關係-->
              <a class="nav-link"
                :class="{'dropdown-toggle': item.subcategories.length !== 0}"
                href="#">
                  {{ item.title }}
              </a>
              <div class="dropdown-menu"
                  v-if="item.subcategories.length !== 0">
                <a class="dropdown-item" href="#"
                    v-for="(subItem, index) in item.subcategories"
                    :key="index">
                    {{ subItem }}
                </a>
              </div>
            </li>
          </ul>
        </div>
        <!-- 購物車內的數量 (Button 內包含 icon, 數量 badge) -->
        <div class="dropdown ml-auto">
          <button class="btn btn-sm btn-cart">
            <i class="fas fa-user-circle text-white"></i>
          </button>
          <button class="btn btn-sm btn-cart">
            <i class="fa fa-shopping-cart text-white" aria-hidden="true"></i>
            <span class="badge badge-pill badge-danger">9</span>
          </button>
        </div>
      </nav>
      <!-- 1 -->
      <section>
        <swiper class="swiper" :options="swiperOption">
          <swiper-slide><img class="w-100" src="./../../assets/images/1.jpg" alt=""></swiper-slide>
          <swiper-slide><img class="w-100" src="./../../assets/images/2.jpg" alt=""></swiper-slide>
          <swiper-slide><img class="w-100" src="./../../assets/images/3.jpg" alt=""></swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </section>
    </main>
    <shopSidebar :sent-categories="categories" @close-aside="openAside(false)"></shopSidebar>
    <div class="bg-color" @click="openAside(false)"></div>
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
};
</script>
