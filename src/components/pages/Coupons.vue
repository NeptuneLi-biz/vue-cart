<template>
  <div class="m-4">
    <loading :active.sync="isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary"
              @click="openModal('add')">建立新的優惠卷</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th witdh="40%">名稱</th>
          <th width="20%">折扣百分比</th>
          <th width="20%">到期日</th>
          <th width="10%">是否啟用</th>
          <th width="10%">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons"
            :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}</td>
          <td>{{ item.date }}</td>
          <td>
            <tr v-if="item.is_enabled"
                class="text-success">啟用</tr>
            <tr v-else>未啟用</tr>
          </td>
          <td>
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-outline-primary"
                    @click="openModal('modify', item)">編輯</button>
              <button type="button" class="btn btn-outline-danger"
                    @click="openModal('del', item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination class="d-flex justify-content-center"
                :sent-page="pagination"
                @change-page="getCoupons"></pagination>
     <!-- couponModal -->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog"
          aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠卷</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title" placeholder="請輸入標題"
                        v-model="tempCoupon.title">
                </div>
                <div class="form-group">
                  <label for="code">優惠卷代碼</label>
                  <input type="text" class="form-control" id="code" placeholder="請輸入優惠卷"
                        v-model="tempCoupon.code">
                </div>
                <div class="form-group">
                  <label for="due_date">到期日</label>
                  <input type="date" class="form-control" id="due_date" placeholder="請輸入到期日"
                        v-model="tempCoupon.date">
                </div>
                <div class="form-group">
                  <label for="percent">折扣百分比</label>
                  <input type="number" class="form-control" id="percent" placeholder="請輸入折扣百分比"
                        v-model="tempCoupon.percent">
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="is_enabled"
                          v-model="tempCoupon.is_enabled"
                          :true-value="1"
                          :false-value="0">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">
              <span v-if="couponAction === 'add' ">新增優惠卷</span>
              <span v-else-if="couponAction === 'modify' ">更新優惠卷</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- delModal -->
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog"
          aria-labelledby="delCouponModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger delCouponModalLabel-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除優惠卷</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠卷(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="updateCoupon">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import pagination from '../Pagination';

export default {
  components: {
    pagination,
  },
  data() {
    return {
      coupons: {},
      isLoading: false, // full page loading
      couponAction: '', // 要對 coupon 做 add新增/modify修改
      tempCoupon: {},
      pagination: {},
    };
  },
  methods: {
    openModal(action, item) {
      const vm = this;
      vm.couponAction = action;
      vm.isLoading = true;
      switch (action) {
        case 'add':
          vm.tempCoupon = {};
          $('#couponModal').modal('show');
          break;
        case 'modify':
          vm.tempCoupon = Object.assign({}, item);
          $('#couponModal').modal('show');
          break;
        case 'del':
          vm.tempCoupon = Object.assign({}, item);
          $('#delCouponModal').modal('show');
          break;
        default:
          vm.tempProduct = {};
      }
      vm.isLoading = false;
    },
    getCoupons(page = 1) {
      const vm = this;
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupons?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        vm.coupons = response.data.coupons;
        vm.pagination = response.data.pagination;
        vm.isLoading = false;
      });
    },
    updateCoupon() {
      const vm = this;
      vm.isLoading = true;
      // 預設是新增優惠卷
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/coupon`;
      let httpMethod = 'post';
      // 修改優惠卷
      if (vm.couponAction === 'modify') {
        api += `/${vm.tempCoupon.id}`;
        httpMethod = 'put';
      }
      // 刪除優惠卷
      if (vm.couponAction === 'del') {
        api += `/${vm.tempCoupon.id}`;
        httpMethod = 'delete';
      }
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
        if (response.data.success) {
          vm.getCoupons(vm.pagination.current_page);
          // Update Success
          this.$bus.$emit('message:push', response.data.message, 'success');
        } else {
          // Update Failure
          this.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.isLoading = false;
        $('#couponModal').modal('hide');
        $('#delCouponModal').modal('hide');
      });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
