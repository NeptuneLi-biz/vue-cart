<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="(item) in products" :key="item.key">
        <div class="card border-0 shadow-sm">
          <div style="height: 150px; background-size: cover; background-position: center"
              :style="{backgroundImage: `url(${item.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#"
                 class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h6" v-if="!item.price">{{ item.origin_price | currency }} 元</div>
              <del            v-if="item.price">原價 {{ item.origin_price |currency }} 元</del>
              <div class="h6" v-if="item.price">現在只要 {{ item.price | currency }} 元</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button"
                    class="btn btn-outline-secondary btn-sm"
                    @click="getProduct(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <button type="button"
                    class="btn btn-outline-danger btn-sm ml-auto"
                    @click="addToCart(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.imageUrl" class="img-fluid" alt="">
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h4" v-if="!product.price">{{ product.origin_price | currency }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price | currency }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price | currency }} 元</div>
            </div>
            <select name="" class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} {{product.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計 <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary"
              @click="addToCart(product.id, product.num)">
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <!-- 購物車頁面 -->
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
    <hr>
    <!-- 訂單送出頁面 -->
    <div class="my-5 row justify-content-center">
      <ValidationObserver class="col-md-6" ref="form" v-slot="{ reset }">
        <form @submit.prevent="createOrder" @reset.prevent="reset">
          <div class="form-group">
            <label for="useremail">Email</label>
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
              <input type="email" class="form-control" id="useremail"
                    v-model="form.user.email" placeholder="請輸入 Email">
              <span class="text-danger" v-if="errors[0]">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <label for="username">收件人姓名</label>
            <ValidationProvider name="name" rules="required" v-slot="{ errors }">
              <input type="text" class="form-control" id="username"
                v-model="form.user.name"
                placeholder="輸入姓名">
              <span class="text-danger" v-if="errors[0]">姓名 {{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <label for="usertel">收件人電話</label>
            <ValidationProvider name="tel" rules="required" v-slot="{ errors }">
              <input type="text" class="form-control" id="usertel"
                v-model="form.user.tel"
                placeholder="請輸入電話">
              <span class="text-danger" v-if="errors[0]">電話 {{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <label for="useraddress">收件人地址</label>
            <ValidationProvider name="address" rules="required" v-slot="{ errors }">
              <input type="text" class="form-control" id="useraddress"
                v-model="form.user.address"
                placeholder="請輸入地址">
              <span class="text-danger" v-if="errors[0]">地址 {{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <label for="comment">留言</label>
            <textarea name="" id="comment" class="form-control"
                      cols="30" rows="10" v-model="form.message"></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-danger">送出訂單</button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      products: [],
      product: {},
      isLoading: false,
      status: {
        loadingItem: '',
      },
      cartData: {},
      coupon_code: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  methods: {
    getProducts() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/products`;
      vm.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.products = response.data.products;
        vm.isLoading = false;
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
      vm.status.loadingItem = id;
      this.$http.post(url, { data: item }).then((response) => {
        vm.status.loadingItem = '';
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.getCart();
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
        }
        $('#productModal').modal('hide');
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
    this.getProducts();
    this.getCart();
  },
};
</script>
