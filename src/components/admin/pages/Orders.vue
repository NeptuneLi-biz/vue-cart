<template>
  <div class="m-4">
    <Loading :active.sync="isLoading"></Loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th class="text-center" width=100>購買時間</th>
          <th class="text-center">Email</th>
          <th>購買款項</th>
          <th class="text-center" width=100>應付金額</th>
          <th class="text-center" width=100>是否付款</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in sortOrder" :key="key"
            :class="{'text-secondary': !item.is_paid}">
          <td class="text-center">{{ item.create_at | date }}</td>
          <td class="text-center"><span v-text="item.user.email" v-if="item.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total | currency }}</td>
          <td>
            <strong v-if="item.is_paid" class="text-success">已付款</strong>
            <span v-else class="text-muted">尚未付款</span>
          </td>
          <td>
            <button type="button" class="btn btn-sm btn-outline-primary"
                    @click="orderModal(item)">編輯</button>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination class="d-flex justify-content-center"
                :sent-page="pagination"
                @change-page="getOrders"></pagination>
    <!-- orderModal -->
    <div class="modal fade" id="orderModal" tabindex="-1" role="dialog"
          aria-labelledby="orderModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="orderModalLabel">
              <span>編輯訂單</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-6">
                <h6 class="alert alert-success">訂單資訊</h6>
                <div class="form-group">
                  <label for="date">訂單日期</label>
                  <input type="text" class="form-control" id="date"
                        :disabled="inputDisabled"
                        v-model="formatDate">
                </div>
                <div class="form-group">
                  <label for="id">訂單編號</label>
                  <input type="text" class="form-control" id="id"
                        :disabled="inputDisabled"
                        v-model="tempOrder.id">
                </div>
                <div class="form-group">
                  <label for="price">訂單金額</label>
                  <input type="text" class="form-control" id="price"
                        :disabled="inputDisabled"
                        v-model="tempOrder.total">
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="is_paid"
                          v-model="tempOrder.is_paid">
                    <label class="form-check-label" for="is_paid">
                      是否付款
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <h6 class="alert alert-success">訂購人資訊</h6>
                <div class="form-group">
                  <label for="mail">Email</label>
                  <input type="email" class="form-control" id="mail" required
                        v-model="tempOrder.user.email">
                </div>
                <div class="form-group">
                  <label for="name">姓名</label>
                  <input type="text" class="form-control" id="name" required
                        v-model="tempOrder.user.name">
                </div>
                <div class="form-group">
                  <label for="tel">電話</label>
                  <input type="text" class="form-control" id="tel" required
                        v-model="tempOrder.user.tel">
                </div>
                <div class="form-group">
                  <label for="address">地址</label>
                  <input type="text" class="form-control" id="address" required
                        v-model="tempOrder.user.address">
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateOrder">更新</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import pagination from '../../Pagination';

export default {
  components: {
    pagination,
  },
  data() {
    return {
      isLoading: false,
      orders: {},
      pagination: {},
      tempOrder: {
        user: {},
      },
      inputDisabled: 'disabled',
    };
  },
  methods: {
    getOrders(page = 1) {
      const vm = this;
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/orders?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        vm.orders = response.data.orders;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
      });
    },
    orderModal(item) {
      const vm = this;
      vm.isLoading = true;
      vm.tempOrder = Object.assign({}, item);
      $('#orderModal').modal('show');
      vm.isLoading = false;
    },
    updateOrder() {
      const vm = this;
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/order/${vm.tempOrder.id}`;
      vm.isLoading = true;
      this.$http.put(api, { data: vm.tempOrder }).then((response) => {
        if (response.data.success) {
          vm.getOrders(vm.pagination.current_page);
          // Update Success
          this.$bus.$emit('message:push', response.data.message, 'success');
        } else {
          // Update Failure
          this.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.isLoading = false;
        $('#orderModal').modal('hide');
      });
    },
  },
  computed: {
    sortOrder() {
      const vm = this;
      let newOrder = [];
      if (vm.orders.length) {
        newOrder = vm.orders.sort((a, b) => {
          const aIsPaid = a.is_paid ? 1 : 0;
          const bIsPaid = b.is_paid ? 1 : 0;
          return bIsPaid - aIsPaid;
        });
      }
      return newOrder;
    },
    formatDate() {
      const vm = this;
      const date = new Date(vm.tempOrder.create_at * 1000);
      return date.toLocaleDateString();
    },
  },
  created() {
    this.getOrders();
  },
};
</script>
