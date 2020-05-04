<template>
  <div class="container">
    <loading :active.sync="sentProps.isLoading"></loading>
    <CheckoutStatus :sent-props="sentProps"></CheckoutStatus>
    <div class="row d-flex justify-content-center my-5">
      <div class="col-12 col-lg-8">
        <div class="card">
          <div class="card-header" id="headingOne">
            <h6 class="mb-0 d-flex align-items-center">
              <a data-toggle="collapse" href="#cartDetail">
                顯示購物車細節
                <i class="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <span class="h3 ml-auto mb-0">{{ sentProps.cartData.final_total | currency }}</span>
            </h6>
          </div>
        </div>
        <div id="cartDetail" class="collapse mt-3 show">
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
              <tr v-for="(item) in sentProps.cartData.carts" :key="item.id">
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
                    ({{ 100 - item.coupon.percent }}% off)
                  </div>
                </td>
                <td class="align-middle">{{ item.qty }} / {{ item.product.unit }}</td>
                <td class="align-middle text-right">{{ item.total | currency  }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="text-right h5">
                <td colspan=3 class="">總價</td>
                <td :style="sentProps.cartData.total !== sentProps.cartData.final_total ?
                    'text-decoration:line-through;' : 'text-decoration: none;'">
                  {{ sentProps.cartData.total | currency }}
                </td>
              </tr>
              <tr class="text-right h5"
                  v-if="sentProps.cartData.total !== sentProps.cartData.final_total">
                <td colspan=3 class="text-success">折扣價</td>
                <td>{{ sentProps.cartData.final_total | currency }}</td>
              </tr>
            </tfoot>
          </table>
          <div class="input-group mb-3 input-group-sm">
            <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
        <div class="text-right mt-5">
          <router-link class="btn btn-primary btn-lg" to="/order_confirm">結帳去</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckoutStatus from '../CheckoutStatus';

export default {
  components: {
    CheckoutStatus,
  },
  props: {
    sentProps: {
      type: Object,
    },
    cartData: {
      type: Object,
    },
  },
  data() {
    return {
      coupon_code: '',
    };
  },
  methods: {
    removeCartItem(id) {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/cart/${id}`;
      vm.sentProps.isLoading = true;
      this.$http.delete(url).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.$emit('sent-carts');
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
          vm.sentProps.isLoading = false;
        }
      });
    },
    addCouponCode() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/coupon`;
      const coupon = {
        code: vm.coupon_code,
      };
      vm.sentProps.isLoading = true;
      this.$http.post(url, { data: coupon }).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.$emit('sent-carts');
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
          vm.sentProps.isLoading = false;
        }
      });
    },
    createOrder() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order`;
      const order = vm.form;
      vm.sentProps.isLoading = true;
      this.$refs.form.validate().then((success) => {
        if (success) {
          this.$http.post(url, { data: order }).then((response) => {
            if (response.data.success) {
              vm.$bus.$emit('message:push', response.data.message, 'success');
              vm.$router.push(`/customer_checkout/${response.data.orderId}`);
              vm.$emit('sent-carts');
              order.user.name = '';
              order.user.email = '';
              order.user.tel = '';
              order.user.address = '';
              order.message = '';
            } else {
              vm.$bus.$emit('message:push', response.data.message, 'danger');
            }
            vm.sentProps.isLoading = false;
          });
        } else {
          vm.sentProps.isLoading = false;
          vm.$bus.$emit('message:push', '欄位填寫不完整', 'danger');
        }
      });
    },
  },
  created() {
    this.sentProps.isHome = false;
    this.sentProps.checkoutStatus = 'ShopCart';
    window.document.documentElement.scrollTop = 0;
  },
};
</script>
