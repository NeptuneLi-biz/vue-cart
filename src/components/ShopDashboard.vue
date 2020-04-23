<template>
  <div>
    <main>
      <nav class="navbar navbar-expand-lg navbar-dark text-white sticky-top"
          :class="{'bg-primary': !isHome}"
          style="transform: translateZ(0);">
        <button class="navbar-toggler mobile-link" type="button" data-toggle="collapse"
              @click="openAside(true)">
          <span class="navbar-toggler-icon"></span>
        </button>
        <router-link class="navbar-brand text-light d-flex" to="/home">
          <img class="d-inline-block align-self-center"
              src="./../assets/images/logo.png"
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
      <router-view></router-view>
      <!-- 購物車的頁面 -->
      <div class="row d-flex justify-content-center my-5">
        <div class="col-6">
        <table class="table">
          <thead>
            <tr>
              <th width="100"></th>
              <th>品名</th>
              <th width="80">數量</th>
              <th width="150" class="text-right">單價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in cartData.carts" :key="item.id">
              <td class="align-middle">
                <button type="button" class="btn btn-outline-danger"
                        @click="removeCartItem(item.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td class="align-middle">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用 <strong>{{ item.coupon.title }}</strong>
                </div>
              </td>
              <td class="align-middle">{{ item.qty }} / {{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.total | currency  }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="text-right h5">
              <td colspan=3 class="">總價</td>
              <td>{{ cartData.total | currency }}</td>
            </tr>
            <tr class="text-right h5" v-if="cartData.total !== cartData.final_total">
              <td colspan=3 class="text-success">折扣價</td>
              <td>{{ cartData.final_total | currency }}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" placeholder="請輸入優惠碼"
                v-model="coupon_code">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button"
                      @click="addCouponCode">
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>
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
import shopSidebar from './ShopSidebar';

export default {
  components: {
    shopSidebar,
  },
  data() {
    return {
      isHome: false,
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
      cartData: {},
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
    getCart() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.cartData = response.data.data;
        vm.isLoading = false;
      });
    },
    removeCartItem(id) {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart/${id}`;
      vm.isLoading = true;
      this.$http.delete(url).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.getCart();
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.isLoading = false;
      });
    },
    addCouponCode() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/coupon`;
      const coupon = {
        code: vm.coupon_code,
      };
      vm.isLoading = true;
      this.$http.post(url, { data: coupon }).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.getCart();
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.isLoading = false;
      });
    },
    createOrder() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order`;
      const order = vm.form;
      vm.isLoading = true;
      this.$refs.form.validate().then((success) => {
        if (success) {
          this.$http.post(url, { data: order }).then((response) => {
            if (response.data.success) {
              // vm.$bus.$emit('message:push', response.data.message, 'success');
              vm.$router.push(`/customer_checkout/${response.data.orderId}`);
              vm.getCart();
              order.user.name = '';
              order.user.email = '';
              order.user.tel = '';
              order.user.address = '';
              order.message = '';
              this.$nextTick(() => {
                this.$refs.form.reset();
              });
            } else {
              vm.$bus.$emit('message:push', response.data.message, 'danger');
            }
            vm.isLoading = false;
          });
        } else {
          vm.isLoading = false;
          vm.$bus.$emit('message:push', '欄位填寫不完整', 'danger');
        }
      });
    },
  },
  created() {
    if (this.isHome) {
      $(window).scroll(() => {
        if (window.scrollY > 100) {
          $('.navbar').addClass('bg-primary');
        } else {
          $('.navbar').removeClass('bg-primary');
        }
      });
    }
    this.getProducts();
  },
};
</script>
