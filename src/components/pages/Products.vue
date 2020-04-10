<template>
  <div class="mt-4">
    <loading :active.sync="isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary" @click="openModal('add')">新增產品</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th width="100">分類</th>
          <th>產品名稱</th>
          <th width="80">原價</th>
          <th width="80">售價</th>
          <th width="100">是否啟用</th>
          <th width="160">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">{{ item.origin_price }}</td>
          <td class="text-right">{{ item.price }}</td>
          <td>
        <tr v-if="item.is_enabled" class="text-success">啟用</tr>
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
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item"
            :class="{'disabled': !pagination.has_pre}"
            @click="getProducts(pagination.current_page - 1)">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item"
            v-for="(page) in pagination.total_pages"
            :key="page"
            :class="{'active': page === pagination.current_page}"
            @click="getProducts(page)">
            <a class="page-link" href="#">{{page}}</a>
        </li>
        <li class="page-item"
            :class="{'disabled': !pagination.has_next}"
            @click="getProducts(pagination.current_page + 1)">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
    <!-- productModal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
          aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結"
                         v-model="tempProduct.imageUrl">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i v-if="status.fileUploading"
                    class="fas fa-spinner fa-spin"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" ref="files"
                        @change="uploadFile()">
                </div>
                <img class="img-fluid" alt=""
                    :src="tempProduct.imageUrl">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title" placeholder="請輸入標題"
                        v-model="tempProduct.title">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category" placeholder="請輸入分類"
                          v-model="tempProduct.category">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit" placeholder="請輸入單位"
                          v-model="tempProduct.unit">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價"
                          v-model="tempProduct.origin_price">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price" placeholder="請輸入售價"
                          v-model="tempProduct.price">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control"
                            id="description" placeholder="請輸入產品描述"
                            v-model="tempProduct.description"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control"
                            id="content" placeholder="請輸入產品說明內容"
                            v-model="tempProduct.content"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="is_enabled"
                          v-model="tempProduct.is_enabled"
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
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <!-- delModal -->
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
          aria-labelledby="delProductModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger delProductModalLabel-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 產品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="updateProduct">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  data() {
    return {
      products: [],
      tempProduct: {},
      pagination: {},
      productAction: '', // 要對 product 做 add新增/modify修改/del刪除
      isLoading: false, // full page loading
      status: {
        fileUploading: false, // part loading
      },
    };
  },
  methods: {
    getProducts(page = 1) {
      const vm = this;
      const api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/products?page=${page}`;
      vm.isLoading = true;
      this.$http.get(api).then((response) => {
        vm.products = response.data.products;
        vm.isLoading = false;
        vm.pagination = response.data.pagination;
      });
    },
    openModal(action, item) {
      const vm = this;
      vm.productAction = action;
      vm.isLoading = true;
      switch (action) {
        case 'add':
          vm.tempProduct = {};
          $('#productModal').modal('show');
          break;
        case 'modify':
          vm.tempProduct = Object.assign({}, item);
          $('#productModal').modal('show');
          break;
        case 'del':
          vm.tempProduct = Object.assign({}, item);
          $('#delProductModal').modal('show');
          break;
        default:
          vm.tempProduct = {};
      }
      vm.isLoading = false;
    },
    updateProduct() {
      const vm = this;
      vm.isLoading = true;
      // 預設是新增產品
      let api = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/product`;
      let httpMethod = 'post';
      // 修改產品
      if (vm.productAction === 'modify') {
        api += `/${vm.tempProduct.id}`;
        httpMethod = 'put';
      // 刪除產品
      } else if (vm.productAction === 'del') {
        api += `/${vm.tempProduct.id}`;
        httpMethod = 'delete';
      }
      this.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => {
        if (response.data.success) {
          vm.getProducts();
          // Update Success
          this.$bus.$emit('message:push', response.data.message, 'success');
        } else {
          // Update Failure
          this.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.isLoading = false;
        $('#productModal').modal('hide');
        $('#delProductModal').modal('hide');
      });
    },
    uploadFile() {
      const uploadedFile = this.$refs.files.files[0];
      const id = this.$refs.files.id;
      const vm = this;
      const formData = new FormData();
      const url = `${process.env.API_PATH}/api/${process.env.CUSTOM_PATH}/admin/upload`;
      vm.status.fileUploading = true;
      formData.append('file-to-upload', uploadedFile);
      this.$http.post(url, formData, {
        header: 'multipart/form-data',
      }).then((response) => {
        if (response.data.success) {
          vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
          document.getElementById(id).value = '';
        } else {
          this.$bus.$emit('message:push', response.data.message, 'danger');
        }
        vm.status.fileUploading = false;
      });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
