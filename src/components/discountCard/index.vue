<template>
  <div class="priceCard">
    <div class="p_top">
      <div class="cardNum">
        <div class="priceMain">
          <span class="saleNum">{{
            cardData.ticketType == "2" ? cardData.discount : cardData.reduceRMB
          }}</span>
          <span class="saleUnit">{{
            cardData.ticketType == "2" ? "折" : "元"
          }}</span>
        </div>
        <div class="priceType">满{{ cardData.moneyOff }}元可用</div>
      </div>
      <div class="condition">
        {{ cardData.ticketCodeName }}/{{
          cardData.ticketType == "2" ? "折扣券" : "满减券"
        }}
      </div>
    </div>
    <div class="endTime">有效期至: {{ cardData.expiryDate }}</div>
  </div>
</template>
<script>
export default {
  name: "Cardyh",
  props: {
    cardData: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
};
</script>
<style scoped lang="less">
.priceCard {
  box-shadow: 0 0 1 #ccc;
  width: 254px;
  height: 110px;

  border-radius: 5px;
  .p_top {
    box-sizing: border-box;
    padding: 10px;
    height: 80px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    background-color: #13b5b1;
    color: #fff;
    .cardNum {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .priceMain {
        align-items: flex-end;
        display: flex;
        .saleNum {
          font-size: 30px;
          font-weight: bold;
          line-height: 30px;
        }
        .saleUnit {
          font-size: 16px;
          line-height: 16px;
        }
      }
      .priceType {
        font-size: 14px;
        line-height: 14px;
      }
    }
    .condition {
      font-size: 14px;
      padding-top: 12px;
      width: 100%;
      //注意点：一定要设置width
     
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .endTime {
    line-height: 30px;
    color: #13b5b1;
    font-size: 14px;
    padding-left: 10px;
    background-color: #fff;
  }
}
</style>
