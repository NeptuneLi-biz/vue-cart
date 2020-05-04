<template>
  <div>
    <div class="checkout-nav text-center my-3">
      <div class="step"
          :class="{'active': sentProps.checkoutStatus === 'ShopCart'}">
        <span class="badge"><span class="text">1</span></span>
        <span>購物車</span>
      </div>
      <div class="step"
          :class="{'active': sentProps.checkoutStatus === 'OrderConfirm'}">
        <span class="badge"><span class="text">2</span></span>
        <span>訂單確認</span>
      </div>
      <div class="step"
          :class="{'active': sentProps.checkoutStatus === 'Checkout'}">
        <span class="badge"><span class="text">3</span></span>
        <span>付款</span>
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
  name: 'CheckoutStatus',
  props: {
    sentProps: {
      type: Object,
    },
  },
};
</script>
