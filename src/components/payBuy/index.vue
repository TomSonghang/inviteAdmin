<template>
  <div class="buyBox">
    <div class="buyL">
      <template>
        <p
          class="buyT"
          v-if="paydata.ServiceData && type == 2"
        >{{ paydata.ServiceData.serviceName }}</p>

        <p class="buyT" v-else="type == 3">{{ paydata.serviceName }}</p>
      </template>
      <template>
        <div class="buyDescript" v-if="type == 3">
          <div>您购买的炒更团职位{{ paydata.serviceName }}需要{{ paydata.serviceCost }}金币。</div>
          <div>或者使用支付宝或微信付款{{ paydata.serviceRMB }}RMB;</div>
          <div>购买金币付款更优惠</div>
        </div>
        <div class="buyDescript" v-if="type != 3">
          <div v-for="(item, index) in descriptData" :key="index">{{ item }}</div>
        </div>
      </template>

      <div class="buyNumber" v-if="type != 3">
        <span>购买数量</span>
        <el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
      </div>
      <div class="buyCard" v-if="type != 3">
        <div v-for="item in cardData" :key="item.id" class="cardItemBox cardActive">
          <discount-card :cardData="item"></discount-card>
        </div>
      </div>
    </div>
    <!--左侧-->
    <div class="buyR">
      <div class="payWay">
        <div
          class="zfbPay zfb"
          :class="zfActive == 'zfb' ? 'zfbActive' : ''"
          @click="handleWay('zfb')"
        >
          <div class="zfbImg">
            <img src="@/assets/images/zfbpay.png" />
          </div>
          <span>支付宝支付</span>
        </div>
        <div class="zfbPay wx" :class="zfActive == 'wx' ? 'wxActive' : ''" @click="handleWay('wx')">
          <div class="zfbImg">
            <img src="@/assets/images/wxpay.png" />
          </div>
          <span>微信支付</span>
        </div>
        <div
          class="zfbPay gold"
          :class="zfActive == 'gold' ? 'goldActive' : ''"
          @click="handleWay('gold')"
        >
          <div class="zfbImg">
            <img src="@/assets/images/goldIcon.png" />
          </div>
          <span>金币支付</span>
        </div>
      </div>
      <div class="payDes">
        <p>请确认左侧信息后支付</p>
        <p>
          还需支付：
          <span v-if="type == 3">{{ paydata.serviceRMB }}元/{{ paydata.serviceCost }}金币</span>
        </p>
      </div>
      <div class="QRbox" v-show="zfActive != 'gold'">
        <div class="vscode">
          <div id="qrcode" ref="qrCodeUrl"></div>
        </div>
        <div class="wayDes">
          <div class="payWabImg">
            <img src="@/assets/images/zfbIcon.png" />
          </div>
          <div class="payWabImg">
            <img src="@/assets/images/wxIcon.png" />
          </div>
          <span>扫码付款</span>
        </div>
      </div>
      <div class="otherDec">
        <p>累计满1000元可联系客服开具发票</p>
      </div>
      <div class="payBtn" v-show="zfActive == 'gold'">
        <el-button type="primary" class="goldBtn">金币支付</el-button>
        <p>剩余金币 301 个</p>
      </div>
    </div>
  </div>
</template>

<script>
import Code from "@/api/statusCode";
import QRCode from 'qrcodejs2'
import discountCard from '@/components/discountCard/index'
import { GetCardTicketList, ServiceOrGoldPayment } from '@/api/serve'
import {
  PartTimePayment
} from '@/api/timeJob'
export default {
  name: "PayBuy",
  data() {
    return {
      num: 1,
      moneyOff: 2980,  //实付价格\
      cardData: [], //可用优惠券数据
      zfActive: 'zfb',
      codeUrl: "",      //付款码链接
      codeNum: ""   //付款码订单号
    }
  },
  props: {
    paydata: {
      type: Object,
      default: function () {
        return {}
      }
    },
    type: {
      type: Number,
      default: 1   //1是职位 2是套餐 3是炒更
    },
    groupId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    descriptData() {
      return this.paydata.ServiceData?.codeIntroduce.split('$@$')
    }
  },
  methods: {
    handleWay(e) {
      this.zfActive = e;
      if (this.type === 3) {   //兼职
        this._PartTimePayment()  //兼职二维码
      } else if (this.type === 2) {   //套餐
        this._ServiceOrGoldPayment()  //服务的二维码
      }
    },
    _ServiceOrGoldPayment() {     //服务获取二维码信息
      let data = {
        payMethod: this.zfActive == 'zfb' ? 'AliPay' : this.zfActive == 'wx' ? 'WxPay' : 'GoldPay',
        entrustType: this.zfActive == 'zfb' ? 4 : 2,
        gold: "",
        serviceId: '7',// this.paydata.ServiceData.serviceId,
        serviceCount: this.num,
      }
      ServiceOrGoldPayment(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
        }
      })
    },
    _PartTimePayment() { //获取兼职二维码
      let data = {
        groupId: this.groupId,
        payMethod: this.zfActive == 'zfb' ? 'AliPay' : this.zfActive == 'wx' ? 'WxPay' : 'GoldPay'
      }
      PartTimePayment(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.codeUrl = res.data.code_url
          this.codeNum = res.data.out_trade_no
          this.qrcode();
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    _GetCardTicketList() {   //可以用优惠券
      let data = {
        code: 0,
        moneyOff: this.moneyOff,
      }
      GetCardTicketList(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.cardData = res.data.usableList
        }
      })
    },
    handleChange(value) {
      console.log(value);
    },
    qrcode() {
      let that = this;
      document.getElementById("qrcode").innerHTML = "";   //生成之前清空
      let qrcode = new QRCode(this.$refs.qrCodeUrl, {
        width: 140,
        height: 140, // 高度
        text: that.codeUrl, // 二维码内容
        background: '#13b5b1'
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // foreground: '#ff0'
      })
      console.log(qrcode)
    },
    refreshCode() {    //刷新付款码
      if (this.type === 3) {   //兼职
        this._PartTimePayment()  //兼职二维码
      } else if (this.type === 2) {   //套餐
        this._ServiceOrGoldPayment()  //服务的二维码
      }
    }
  },
  components: {
    discountCard
  },
  mounted() {
    this.refreshCode()  //获取付款码
    if (this.type === 3) {   //兼职

    } else if (this.type === 2) {   //套餐
      this._GetCardTicketList();    //显示优惠券
    }

  }
}
</script>

<style lang="less" scoped>
.buyBox {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.buyL {
}
.buyT {
  color: #333;
  font-size: 16px;
  padding-bottom: 20px;
  font-weight: bold;
}

.buyDescript {
  color: #666;
  font-size: 14px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f5f5f5;
  div {
    padding: 5px 0;
  }
}
.buyNumber {
  padding: 20px 0;
  span {
    margin-right: 10px;
  }
}
.buyCard {
  background-color: #f8f9fb;
  width: 350px;
  box-sizing: border-box;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
  .cardItemBox {
    margin-bottom: 10px;
    cursor: pointer;
    display: inline-block;
  }
  .cardActive {
    border: 3px solid #fa6b46;
    border-radius: 3px;
  }
}
.payWay {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: 20px;
}
.zfbPay {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  border: 1px solid #ccc;
  padding: 5px 20px;
  margin-right: 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 5px;
  span {
    margin-left: 5px;
  }
}
.zfbImg {
  width: 26px;
  height: 26px;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.zfb {
  &:hover {
    color: rgb(62, 135, 219);
    border: 1px solid rgb(62, 135, 219);
  }
}
.zfbActive {
  color: rgb(62, 135, 219);
  border: 1px solid rgb(62, 135, 219);
}
.wx {
  &:hover {
    color: rgb(27, 156, 92);
    border: 1px solid rgb(27, 156, 92);
  }
}
.wxActive {
  color: rgb(27, 156, 92);
  border: 1px solid rgb(27, 156, 92);
}
.gold {
  &:hover {
    color: rgb(207, 157, 19);
    border: 1px solid rgb(207, 157, 19);
  }
}
.goldActive {
  color: rgb(207, 157, 19);
  border: 1px solid rgb(207, 157, 19);
}
.payDes {
  font-size: 14px;
  color: #666;
  p {
    line-height: 30px;
  }
  span {
    color: #fa6b46;
    font-size: 18px;
    font-weight: bold;
  }
}
.QRbox {
  margin-top: 20px;
}
.vscode {
  width: 140px;
  height: 140px;
  background-color: #333;
}
.payWabImg {
  width: 22px;
  height: 22px;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.wayDes {
  margin-top: 10px;
  display: flex;
  align-items: center;
  div {
    margin-right: 5px;
    color: #666;
  }
}
.otherDec {
  font-size: 14px;
  color: #666;
  margin-top: 20px;
  line-height: 26px;
  margin-bottom: 16px;
}
.goldBtn {
  background-color: #fa6b46;
  border: 1px solid #fa6b46;
  width: 350px;
}
.payBtn {
  p {
    padding-top: 5px;
    font-size: 14px;
    color: #999;
  }
}
</style>