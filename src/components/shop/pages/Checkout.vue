<template>
  <div class="container">
    <loading :active.sync="sentProps.isLoading"></loading>
    <CheckoutStatus :sent-props="sentProps"></CheckoutStatus>
    <div class="my-5 row justify-content-center">
      <form class="col-12 col-lg-8" @submit.prevent="payOrder">
        <table class="table mb-0">
          <thead>
            <th>品名</th>
            <th width="20%" class="text-right">數量</th>
            <th width="20%" class="text-right">單價</th>
          </thead>
          <tbody>
            <tr v-for="item in order.products" :key="item.id">
              <td class="align-middle">{{ item.product.title }}</td>
              <td class="align-middle text-right">{{ item.qty }}/{{ item.product.unit }}</td>
              <td class="align-middle text-right">{{ item.final_total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="align-middle text-right">總計</td>
              <td class="align-middle text-right">{{ order.total }}</td>
            </tr>
          </tfoot>
        </table>
        <table class="table">
          <tbody>
            <tr>
              <th width="100">Email</th>
              <td>{{ order.user.email }}</td>
            </tr>
            <tr>
              <th>姓名</th>
              <td>{{ order.user.name }}</td>
            </tr>
            <tr>
              <th>收件人電話</th>
              <td>{{ order.user.tel }}</td>
            </tr>
            <tr>
              <th>收件人地址</th>
              <td>{{ order.user.address }}</td>
            </tr>
            <tr>
              <th>付款狀態</th>
              <td>
                <span v-if="!order.is_paid">尚未付款</span>
                <span v-else class="text-success">付款完成</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-right" v-if="order.is_paid === false">
          <button class="btn btn-primary btn-lg">確認付款去</button>
        </div>
      </form>
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
  },
  data() {
    return {
      orderId: '',
      order: {
        user: {},
      },
    };
  },
  methods: {
    getOrder() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/order/${vm.orderId}`;
      vm.sentProps.isLoading = true;
      this.$http.get(url).then((response) => {
        vm.order = response.data.order;
        vm.sentProps.isLoading = false;
      });
    },
    payOrder() {
      const vm = this;
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/pay/${vm.orderId}`;
      vm.sentProps.isLoading = true;
      this.$http.post(url).then((response) => {
        if (response.data.success) {
          vm.$bus.$emit('message:push', response.data.message, 'success');
          vm.getOrder();
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger');
          vm.sentProps.isLoading = false;
        }
      });
    },
  },
  created() {
    this.orderId = this.$route.params.orderId;
    this.getOrder();
    this.sentProps.isHome = false;
    this.sentProps.checkoutStatus = 'Checkout';
    window.document.documentElement.scrollTop = 0;
  },
};
</script>
