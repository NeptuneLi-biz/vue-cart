<template>
  <div class="container">
    <loading :active.sync="sentProps.isLoading"></loading>
    <CheckoutStatus :sent-props="sentProps"></CheckoutStatus>
    <div class="my-3 row justify-content-center">
      <form class="col-12 col-lg-8" @submit.prevent="payOrder">
        <h5 class="py-3 mb-2 text-center bg-light">
          訂單確認
        </h5>
        <table class="table">
          <thead>
            <th>品名</th>
            <th width="20%" class="text-right">數量</th>
            <th width="30%" class="text-right">單價</th>
          </thead>
          <tbody>
            <tr v-for="item in sentProps.cartData.carts" :key="item.id">
              <td class="align-middle">{{ item.product.title }}</td>
              <td class="align-middle text-right">{{ item.qty }} / {{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="text-right h5">
             <td colspan=2 class="">總價</td>
              <td :style="sentProps.cartData.total !== sentProps.cartData.final_total ?
                  'text-decoration:line-through;' : 'text-decoration: none;'">
                {{ sentProps.cartData.total | currency }}
              </td>
            </tr>
            <tr class="text-right h5"
                v-if="sentProps.cartData.total !== sentProps.cartData.final_total">
              <td colspan=2 class="text-success">折扣價</td>
              <td>{{ sentProps.cartData.final_total | currency }}</td>
            </tr>
          </tfoot>
        </table>
      </form>
    </div>
    <div class="row justify-content-center mb-3">
      <ValidationObserver class="col-12 col-lg-8" ref="form" v-slot="{ reset }">
        <h5 class="py-3 mb-2 text-center bg-light">
          訂購人資訊
        </h5>
        <form @submit.prevent="createOrder" @reset.prevent="reset">
          <div class="form-group">
            <label for="userEmail">Email</label>
            <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
              <input type="email" class="form-control" id="userEmail"
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
            <label for="userTel">收件人電話</label>
            <ValidationProvider name="tel" rules="required" v-slot="{ errors }">
              <input type="text" class="form-control" id="userTel"
                v-model="form.user.tel"
                placeholder="請輸入電話">
              <span class="text-danger" v-if="errors[0]">電話 {{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form-group">
            <label for="userAddress">收件人地址</label>
            <ValidationProvider name="address" rules="required" v-slot="{ errors }">
              <input type="text" class="form-control" id="userAddress"
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
            <button class="btn btn-primary btn-lg">送出訂單</button>
          </div>
        </form>
      </ValidationObserver>
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
      orderId: '',
      order: {
        user: {},
      },
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
    createOrder() {
      const vm = this;
      if (vm.sentProps.cartData.total === 0) {
        vm.$bus.$emit('message:push', '金額為 0 時,無法送出訂單', 'danger');
        return;
      }
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order`;
      const order = vm.form;
      vm.sentProps.isLoading = true;
      this.$refs.form.validate().then((success) => {
        if (success) {
          this.$http.post(url, { data: order }).then((response) => {
            if (response.data.success) {
              vm.$bus.$emit('message:push', response.data.message, 'success');
              vm.$router.push(`/checkout/${response.data.orderId}`);
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
    this.sentProps.checkoutStatus = 'OrderConfirm';
    window.document.documentElement.scrollTop = 0;
  },
};
</script>
