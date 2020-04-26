<template>
  <div>
    <section class="text-center my-3 checkout-nav">
      <div class="step active">
        <span class="badge"><span class="text">1</span></span>
        <span>購物車</span>
      </div>
      <div class="step">
        <span class="badge"><span class="text">2</span></span>
        <span>填寫資料</span>
      </div>
      <div class="step">
        <span class="badge"><span class="text">3</span></span>
        <span>訂單確認</span>
      </div>
    </section>
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
                </div>
              </td>
              <td class="align-middle">{{ item.qty }} / {{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.total | currency  }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="text-right h5">
              <td colspan=3 class="">總價</td>
              <td>{{ sentProps.cartData.total | currency }}</td>
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkout-nav {
  .step {
    display: inline-block;
    vertical-align: top;
    width: 240px;
    max-width: 33%;
    margin-left: -2px;
    margin-right: -2px;
    color: black;

    span {
      display: block;
      padding: 0 5px;
    }

    .badge {
      position: relative;
      background-color: transparent;
      height: 50px;
      line-height: 50px;
      padding: 0;

      .text {
        position: absolute;
        width: 100%;
        z-index: 1;
        color: white;
      }
    }

    .badge::before {
      content: " ";
      background-color: #cccccc;
      height: 2px;
      width: 100%;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -1px;
      z-index: 0;
    }

    .badge::after{
      border-radius: 15px;
      transform: translate(-50%, -50%);
      content: " ";
      background-color: #cccccc;
      height: 30px;
      width: 30px;
      left: 50%;
      top: 50%;
      position: absolute;
      z-index: 0;
    }
  }
  .step:first-child .badge::before {
    width: 50%;
    left: 50%;
  }
  .step:last-child .badge::before {
    width: 50%;
    right: 50%;
  }
  .step.active .badge::after {
    background-color: #9daab2;
  }
}
</style>

<script>
export default {
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
    this.sentProps.isHome = false;
  },
};
</script>
