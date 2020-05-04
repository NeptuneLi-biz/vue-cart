<template>
  <div class="container-fluid">
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="d-none d-lg-block col-lg-2">
        <div class="list-group sticky-top" id="shopSide">
            <router-link
              class="list-group-item list-group-item-action"
              :class="{'active': sentProps.category === '全部商品',
                       'text-white': sentProps.category === '全部商品'}"
              data-toggle="list"
              @click.native="sentProps.category = '全部商品'; scrollToTop();"
              :to="`/shop`">
              全部商品
            </router-link>
            <router-link
              class="list-group-item list-group-item-action"
              data-toggle="list"
              v-for="(item) in sentProps.categories[0].subcategories" :key="item"
              :class="{'active': sentProps.category === item,
                       'text-white': sentProps.category === item}"
              @click.native="sentProps.category = item; scrollToTop();"
              :to="`/shop/${item}`">
              {{ item }}
            </router-link>
        </div>
      </div>
      <div class="col-12 col-lg-10 row">
        <div class="col-12 col-sm-6 col-md-4 mb-4" v-for="(item) in filterProducts" :key="item.key">
          <div class="card border-0 shadow-sm">
            <router-link :sent-product="item.id"
                        :to="`/shop/${item.category}/${item.id}`">
              <div class="card-img"
                  :style="{backgroundImage: `url(${item.imageUrl})`}">
              </div>
              <div class="card-body">
                <span class="badge badge-secondary float-right ml-2 p-2">{{ item.category }}</span>
                <h5 class="card-title">
                  {{ item.title }}
                </h5>
                <div class="d-flex justify-content-between align-items-baseline">
                  <div class="h6 ml-auto"
                      v-if="!item.price">
                    {{ item.origin_price | currency }} 元
                  </div>
                  <del class="" v-if="item.price">原價 {{ item.origin_price |currency }} 元</del>
                  <div class="h6" v-if="item.price">現在只要 {{ item.price | currency }} 元</div>
                </div>
              </div>
            </router-link>
            <div class="card-footer d-flex">
              <button class="btn btn-outline-danger btn-sm ml-auto"
                      id="addBtn"
                      type="button"
                      @click="addToCart(item.id)">
                <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                加到購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .card-img {
    height: 300px;
    background-size: cover;
    background-position: center;
  }
  .card:hover {
    transition: 0.2s;
    transform: scale(1.02);
    box-shadow: 0 1px 6px 0 rgba(0,0,0,0.2);
    // cursor: pointer;
  }
</style>

<script>
import $ from 'jquery';

export default {
  props: {
    sentProps: {
      type: Object,
    },
  },
  data() {
    return {
      products: [],
      product: {},
      isLoading: false,
      status: {
        loadingItem: '',
      },
      subItem: '',
    };
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products/all`;
      vm.sentProps.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.products = response.data.products;
        vm.sentProps.isLoading = false;
      });
    },
    getProduct(id) {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/product/${id}`;
      vm.status.loadingItem = id;
      this.$http.get(url).then((response) => {
        vm.product = response.data.product;
        vm.$set(vm.product, 'num', 1);
        $('#productModal').modal('show');
        vm.status.loadingItem = '';
      });
    },
    addToCart(id, qty = 1) {
      const vm = this;
      const item = {
        product_id: id,
        qty,
      };
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart`;
      const addBtn = document.getElementById('addBtn');
      vm.status.loadingItem = id;
      addBtn.disabled = true;
      this.$http.post(url, { data: item }).then((response) => {
        if (response.data.success) {
          vm.$emit('sent-carts');
          vm.$bus.$emit('message:push', response.data.message, 'success');
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.status.loadingItem = '';
        addBtn.disabled = false;
        $('#productModal').modal('hide');
      });
    },
    scrollToTop() {
      const vm = this;
      vm.sentProps.isLoading = true;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto',
      });
      setTimeout(() => {
        vm.sentProps.isLoading = false;
      }, 300);
    },
  },
  created() {
    this.getProducts();
    this.sentProps.isHome = false;
  },
  mounted() {
    // fix nav height
    const vm = this;
    vm.sentProps.navHeight = document.querySelector('.navbar').offsetHeight;
    // eslint-disable-next-line
    document.getElementById('shopSide').setAttribute('style', `top: ${vm.sentProps.navHeight + 5}px;`);
  },
  computed: {
    filterProducts() {
      const vm = this;
      const category = vm.sentProps.category;
      if (category === '商品分類' || category === '全部商品' || category === '' || category === 'shop') { return vm.products; }
      const filters = vm.products.filter((item) => {
        if (item.category === category) {
          return true;
        }
        return false;
      });
      return filters;
    },
  },
};
</script>
