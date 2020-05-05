<template>
  <div>
    <Alert :sent-props="sentProps"></Alert>
    <loading :active.sync="sentProps.isLoading"></loading>
    <nav class="navbar navbar-expand-lg navbar-dark text-white sticky-top"
        :class="{'bg-primary': !sentProps.isHome}">
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
              v-for="(item) in sentProps.categories" :key="item.title"
              :class="{'dropdown': item.subcategories.length !== 0}"
              @mouseover="showMenu(true, 'menu' + item.title)"
              @mouseleave="showMenu(false, 'menu' + item.title)">
            <router-link class="nav-link"
                        :class="{'dropdown-toggle': item.subcategories.length !== 0}"
                        :to="item.link"
                        @click.native="sentProps.category = item.title;">
              {{ item.title }}
            </router-link>
            <div class="dropdown-menu"
                v-if="item.subcategories.length !== 0"
                :id="`menu${item.title}`">
              <router-link class="dropdown-item"
                          v-for="(subitem, index) in item.subcategories"
                          :key="index"
                          @click.native="sentProps.category = subitem;
                                        showMenu(false,  'menu' + item.title);"
                          :to="`/shop/${subitem}`">
                {{ subitem }}
              </router-link>
            </div>
          </li>
        </ul>
      </div>
      <div class="ml-auto">
        <router-link class="btn btn-sm" to="/login">
          <i class="fas fa-cog text-white"></i>
        </router-link>
        <div class="dropdown d-inline-block"
              @mouseover="showMenu(true, 'cartMenu')"
              @mouseleave="showMenu(false, 'cartMenu')">
          <router-link class="btn btn-sm dropdown"
                      to="/shop_cart">
            <i class="fa fa-shopping-cart text-white"></i>
            <span class="badge badge-pill badge-danger"
                  v-if="sentProps.cartData.carts">
              {{ sentProps.cartData.carts.length }}
            </span>
          </router-link>
          <div class="dropdown-menu text-center dropdown-menu-right py-0 cart-menu" id="cartMenu">
            <div class="sticky-top px-3 py-2 bg-light">
              <span class="h6 d-block">購物清單</span>
              <div class="d-flex justify-content-between">
                <router-link class="btn btn-primary btn-sm"
                            to="/shop_cart"
                            @click.native="showMenu(false, 'cartMenu')">
                  購物車
                </router-link>
                <router-link class="btn btn-primary btn-sm"
                            to="/order_confirm"
                            @click.native="showMenu(false, 'cartMenu')">
                  結帳
                </router-link>
              </div>
            </div>
            <table class="table mb-2">
              <thead>
                <tr>
                  <th width=15%>刪除</th>
                  <th>名稱</th>
                  <th width=20%>數量</th>
                  <th width=20%>金額</th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="item in sentProps.cartData.carts" :key="item.id">
                      <td class="align-middle text-center">
                          <button class="btn text-secondary" @click="removeCartItem(item.id)">
                              <i class="fas fa-trash-alt"></i>
                          </button>
                      </td>
                      <td class="align-middle">{{ item.product.title }}</td>
                      <td class="align-middle">{{ item.qty }} {{ item.product.unit }}</td>
                      <td class="align-middle text-right">{{ item.final_total | currency }}</td>
                  </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </nav>
    <router-view :sent-props="sentProps" @sent-carts="getCart()"></router-view>
    <shopSidebar :sent-props="sentProps"
                @close-aside="openAside(false)">
    </shopSidebar>
    <footer class="py-2 bg-primary"
            id="footer">
      <div class="container position-relative">
        <div class="row">
          <div class="pg-up position-absolute">
            <a href="#"
                class="pg-up-icon"
                 @click.prevent="scrollToTop">
              <span class="fas fa-chevron-up pg-up-icon-wheel"></span>
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <router-link class="navbar-brand text-light d-flex" to="/home">
              <img class="d-inline-block align-self-center"
                  src="./../../assets/images/logo.png"
                  width="50" height="50" alt="">
              <div class="d-inline-block align-self-center ml-2">Neon Tattoo</div>
            </router-link>
          </div>
          <div class="col-md-6">
            <ul class="nav justify-content-end mb-3">
              <li v-for="(item, index) in footer" :key="`footerKey${index}`" style="z-index: 11;">
                <a :href="item.url"
                  class="h2 mr-3 text-light" target="_blank">
                  <span :class="item.img"></span>
                </a>
              </li>
            </ul>
            <p class="text-right text-light">
              Copyright © {{ author.year }} {{ author.name }}.All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
    <div class="bg-color" @click="openAside(false)"></div>
  </div>
</template>

<style scoped lang="scss">
  .dropdown-menu {
    margin-top: -5px;
  }
  .navbar {
    transition: background-color 1s ease 0s;
    transform: translateZ(0);
    z-index: 1030;
    .cart-menu {
      width: 400px;
      height: 500px;
      overflow: auto;
    }
  }
  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .pg-up {
    left: 0;
    right: 0;
    top: -30px;
    z-index: 10;
    .pg-up-icon {
      width: 60px;
      height: 60px;
      border: 1px solid rgba(255,255,255,.7);
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      position: relative;
      text-align: center;
      margin: 0 auto;
      display: block;
      .pg-up-icon-wheel {
        animation: 2.0s ease infinite wheel-up-down;
        color: #000;
        font-size: 16px;
      }
    }
  }
  .bg-color {
    transition: all .3s;
  }
  @keyframes wheel-up-down {
    100% {
      opacity: 1;
    }
    0% {
      margin-top: 20px;
      opacity: 0;
    }
  }
</style>

<script>
import $ from 'jquery';
import shopSidebar from './ShopSidebar';
import Alert from '../AlertMessage';

export default {
  components: {
    shopSidebar,
    Alert,
  },
  data() {
    return {
      sentProps: {
        isHome: true,
        cartData: {},
        checkoutStatus: '',
        category: '',
        isLoading: false,
        navHeight: 76,
        categories: [
          {
            title: '商品分類',
            subcategories: [],
            link: '/shop',
          },
          {
            title: '全部商品',
            subcategories: [],
            link: '/shop',
          },
          {
            title: '使用方法',
            subcategories: [],
            link: '/teach',
          },
        ],
      },
      products: {},
      coupon_code: '',
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
      author: {
        name: 'NeptuneLi',
        year: new Date().getFullYear(),
      },
      footer: [
        {
          url: 'https://github.com/NeptuneLi-biz/vue-cart',
          img: 'fab fa-github',
        },
        {
          url: 'https://medium.com/neptune-coding',
          img: 'fab fa-medium',
        },
      ],
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
        document.querySelectorAll('.list-unstyled.collapse').forEach((item) => {
          item.classList.remove('show');
        });
      }
    },
    showMenu(isOpen, id) {
      const dropdownMenu = document.getElementById(id);
      if (dropdownMenu === null) { return; }
      if (isOpen) {
        dropdownMenu.classList.add('d-md-block');
      } else {
        dropdownMenu.classList.remove('d-md-block');
      }
    },
    getProducts() {
      const vm = this;
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products/all`;
      this.$http.get(api).then((response) => {
        vm.products = response.data.products;
        vm.products.forEach((item) => {
          if (item.category) {
            vm.sentProps.categories[0].subcategories.push(item.category);
          }
        });
        vm.sentProps.categories[0].subcategories = [...(
          new Set(vm.sentProps.categories[0].subcategories))];
      });
    },
    getCart() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
      vm.sentProps.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.sentProps.cartData = response.data.data;
        vm.sentProps.isLoading = false;
      });
    },
    removeCartItem(id) {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart/${id}`;
      vm.sentProps.isLoading = true;
      this.$http.delete(url).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.getCart();
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
          vm.sentProps.isLoading = false;
        }
      });
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
  },
  created() {
    this.getProducts();
    this.getCart();
    const vm = this;
    $(window).scroll(() => {
      if (vm.sentProps.isHome) {
        if (window.scrollY > 100) {
          $('.navbar').addClass('bg-primary');
        } else {
          $('.navbar').removeClass('bg-primary');
        }
      }
    });
    vm.sentProps.category = decodeURIComponent(location.hash.split('/').reverse().find((item) => {
      if (decodeURIComponent(item).length > 12) {
        return false;
      }
      return true;
    }));
  },
  mounted() {
    const vm = this;
    // fix nav height
    vm.sentProps.navHeight = document.querySelector('.navbar').offsetHeight;
    // fix footer height
    document.getElementById('app').setAttribute('style', 'min-height: 100%; position: relative; margin:0;');
    document.lastChild.setAttribute('style', 'height: 100%;');
    document.body.setAttribute('style', 'height: 100%;');
    const footer = document.getElementById('footer');
    footer.setAttribute('style', `bottom: -${footer.offsetHeight * 2}px;`);
  },
};
</script>
