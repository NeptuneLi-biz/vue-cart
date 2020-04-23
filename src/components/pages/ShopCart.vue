<template>
  <div>
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
          <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
              套用優惠碼
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartData: {},
      coupon_code: '',
    };
  },
  methods: {
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
};
</script>
