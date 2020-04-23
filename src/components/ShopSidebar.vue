<template>
  <div>
    <aside>
      <div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
        <section class="title bg-primary">
          <a href="#" class="mobile-close" @click="closeAside">關閉</a>
        </section>
        <ul class="navbar-nav">
          <li class="nav-item"
              v-for="(item) in sentCategories" :key="item.title"
              :class="{'dropdown': item.subcategories.length !== 0}">
            <!-- NOTE: 之後是用 routerLink ,所以現在沒 preventDefault 沒關係-->
            <a class="nav-link"
              :class="{'dropdown-toggle': item.subcategories.length !== 0}"
              :href="'#' + item.title"
              data-toggle="collapse">
                {{ item.title }}
            </a>
            <div class="list-unstyled collapse"
                 v-if="item.subcategories.length !== 0"
                 :id="item.title">
              <a class="dropdown-item" href="#"
                  v-for="(subItem, index) in item.subcategories"
                  :key="index">{{ subItem }}
              </a>
            </div>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </aside>
  </div>
</template>

<style lang="scss">
  $asideBgColor: rgba(53, 64, 52, 1);
  $asideFontColor: white;
  /*增加 class open 觸發選單*/
  .open aside {
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
      height: 56px;
      background-color: lightblue;
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
    sentCategories: {
      type: Array,
    },
  },
  methods: {
    closeAside() {
      const vm = this;
      vm.$emit('close-aside');
    },
  },
};
</script>
