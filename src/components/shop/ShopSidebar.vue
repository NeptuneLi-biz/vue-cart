<template>
  <div class="side">
    <loading :active.sync="sentProps.isLoading"></loading>
    <div class="navbar-collapse offcanvas-collapse">
      <div class="title bg-primary d-flex justify-content-between align-items-center">
        <div class="ml-3 d-flex align-items-center">
          <img class=""
              src="./../../assets/images/logo.png"
              width="50" height="50">
          <span class="ml-2 text-white h4 mb-0">Neon Tattoo</span>
        </div>
        <button class="btn mobile-close mr-3" @click="closeAside()">
          <i class="far fa-times-circle fa-2x text-white"></i>
        </button>
      </div>
      <ul class="navbar-nav">
        <li class="nav-item"
            v-for="(item) in sentProps.categories" :key="item.title"
            :class="{'dropdown': item.subcategories.length !== 0}">
          <router-link class="nav-link h4 p-2"
                      :class="{'dropdown-toggle': item.subcategories.length !== 0}"
                      :to="item.link"
                      :href="'#' + item.title"
                      @click.native="sentProps.category = item.title;
                                    closeAside(item.subcategories.length !== 0)"
                      data-toggle="collapse">
            {{ item.title }}
          </router-link>
          <div class="list-unstyled collapse"
                v-if="item.subcategories.length !== 0"
                :id="item.title">
             <router-link class="dropdown-item h5 px-5"
                          v-for="(subitem, index) in item.subcategories"
                          :key="index"
                          @click.native="sentProps.category = subitem; closeAside();"
                          :to="`/shop/${subitem}`">
                {{ subitem }}
              </router-link>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
  $asideBgColor: rgba(53, 64, 52, 1);
  $asideFontColor: white;
  .open .side {
    .offcanvas-collapse {
      transform: translateX(0%);
    }
  }
  .offcanvas-collapse {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 80%;
    overflow: hidden;
    transform: translateX(-100%);
    transition: all .3s;
    z-index: 10000;
    background-color: $asideBgColor;
    .title {
      height: 0px;
      background-color: lightBlue;
      a {
        font-size: 20pt;
        color: white;
      }
    }
    .navbar-nav .dropdown-item,
    .navbar-nav .dropdown-menu{
      background-color: $asideBgColor;
      color: $asideFontColor
    }
    .navbar-nav .nav-item .nav-link {
      color: $asideFontColor
    }
  }
</style>

<script>
export default {
  name: 'ShopSidebar',
  props: {
    sentProps: {
      type: Object,
    },
  },
  methods: {
    closeAside(haveSubitem) {
      if (!haveSubitem) {
        const vm = this;
        vm.$emit('close-aside');
      }
    },
  },
  mounted() {
    // fix nav height
    const vm = this;
    vm.sentProps.navHeight = document.querySelector('.navbar').offsetHeight;
    document.querySelector('.title').setAttribute('style', `height: ${vm.sentProps.navHeight}px;`);
  },
};
</script>
