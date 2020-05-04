<template>
  <div>
    <loading :active.sync="sentProps.isLoading"></loading>
    <div class="container">
      <nav aria-label="breadcrumb">
        <ul class="breadcrumb bg-transparent border-bottom rounded-0 h5 mb-0">
          <li class="breadcrumb-item">
            <router-link to="/home">首頁</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/shop"
                        @click.native="sentProps.category = '全部商品';">
              全部商品
            </router-link>
          </li>
          <li class="breadcrumb-item" v-if="sentProps.category !== '全部商品'">
            <router-link :to="`/shop/${sentProps.category}`"
                        v-if="sentProps.category !== '全部商品'">
              {{ sentProps.category }}
            </router-link>
          </li>
        </ul>
      </nav>
      <div class="row mt-2">
        <div class="col-md-7">
          <img class="img-fluid mx-auto d-block" :src="product.imageUrl" alt="">
        </div>
        <div class="col-md-5">
          <h3 class="mb-5">{{ product.title }}</h3>
          <h5>規格</h5>
          <p v-for="(description, index) in product.descriptionArray" :key="`description${index}`">
            {{ description }}
          </p>
          <h5 class="mt-5">說明</h5>
          <p v-for="(content, index) in product.contentArray" :key="`content${index}`">
            {{ content }}
          </p>
          <div class="d-flex justify-content-between align-items-center mt-5">
            <div>
              <h6 class="font-weight-bold" v-if="!product.price">
                {{ product.origin_price | currency }}
              </h6>
              <del class="small text-muted font-weight-bold" v-if="product.price">
                {{ product.origin_price | currency }}
              </del>
              <h5 class="text-danger font-weight-bold" v-if="product.price">
                {{ product.price | currency }}
              </h5>
            </div>
            <div class="text-muted">
              <span v-if="!product.price">
                小計 {{ product.num * product.origin_price | currency }}
              </span>
              <span v-if="product.price">
                小計 {{ product.num * product.price | currency }}
              </span>
            </div>
          </div>
          <div class="d-flex justify-content-between
                      align-items-md-center row">
            <select class="col-12 col-md-5 form-control my-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="`num${num}`">
                {{ num }} {{product.unit}}
              </option>
            </select>
            <button class="col-12 col-md-5  btn btn-danger my-3 w-100"
                    id="addBtn"
                    type="button"
                    @click="addToCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === product.id"></i>
              加入購物車
            </button>
          </div>
        </div>
      </div>
      <hr>
      <teach :sent-props="sentProps"></teach>
    </div>
  </div>
</template>

<script>
import teach from './Teach';

export default {
  components: {
    teach,
  },
  props: {
    sentProps: {
      type: Object,
    },
    sentProduct: {
      type: Object,
    },
  },
  data() {
    return {
      isLoading: false,
      product: {},
      cartNumber: 1,
      status: {
        loadingItem: '',
      },
    };
  },
  methods: {
    getProduct(id) {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/product/${id}`;
      vm.sentProps.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.product = response.data.product;
        vm.$set(vm.product, 'num', 1);
        vm.sentProps.isLoading = false;
        vm.product.descriptionArray = vm.product.description ? vm.product.description.split(/[\n\r]/g) : [];
        vm.product.contentArray = vm.product.content ? vm.product.content.split(/[\n\r]/g) : [];
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
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.$emit('sent-carts');
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.status.loadingItem = '';
        addBtn.disabled = false;
      });
    },
  },
  created() {
    this.sentProps.isHome = false;
    this.getProduct(this.$route.params.productId);
    window.scrollTo({
      top: 0,
      left: 0,
    });
  },
};
</script>
