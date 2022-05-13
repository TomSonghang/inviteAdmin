<template>
  <div class="contextWrap">
    <el-dialog title="金币明细" :visible.sync="dialogTableVisible">
      <el-table :data="goldData">
        <el-table-column property="createDateTime" label="时间"></el-table-column>
        <el-table-column property="goldType" label="用途/来源"></el-table-column>
        <el-table-column property="inOrOut" label="数量"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="pageNo"
        :total="total"
        :page-size="5"
        class="fyDiv"
        @current-change="handlePage"
      ></el-pagination>
    </el-dialog>

    <el-dialog title="购买记录" :visible.sync="dialogTableVisible1">
      <el-table :data="buyData">
        <el-table-column property="codeName" label="类型" width="300"></el-table-column>
        <el-table-column property="createDateTime" label="时间" width="250"></el-table-column>
        <el-table-column property="type" label="方式">
          <template slot-scope="scope">
            <span>{{ scope.row.type | typeWay }}</span>
          </template>
        </el-table-column>
        <el-table-column property="buyRMB" label="金额"></el-table-column>
        <el-table-column property="purchases" label="数量"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="pageNo1"
        :total="total1"
        class="fyDiv"
        @current-change="handlePage1"
      ></el-pagination>
    </el-dialog>

    <el-dialog title="优惠券" :visible.sync="dialogTableVisibleCard">
      <div class="cardBox">
        <div v-for="item in cardList" class="cardContent">
          <discount-card :cardData="item"></discount-card>
        </div>
      </div>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page="pageNoCard"
        :total="cardTotal"
        class="fyDiv"
        @current-change="handlePageCard"
      ></el-pagination>
    </el-dialog>

    <el-dialog title="支付购买" :visible.sync="dialogTableVisiblePay" destroy-on-close>
      <pay-buy :paydata="paydata" :type="tag ? 2 : 4" @closedShow="closedShow"></pay-buy>
    </el-dialog>
    <tab-item :liItem="liItem" @checkStatu="checkStatu" :active="activeItem"></tab-item>
    <div class="main">
      <div class="left">
        <template v-if="serviceType === 1">
          <div class="contextBox" v-for="item in serve1">
            <div class="serveList">
              <div class="listItem1">
                <div class="serveItem" v-for="todo in item.subService.slice(0, 5)">
                  <p class="title">{{ todo.codeName }}</p>
                  <p class="descript">{{ todo.rmb }}元 / {{ todo.cost }}金币</p>
                </div>
              </div>
              <div class="listItem1">
                <div class="serveItem" v-for="todo in item.subService.slice(5, 10)">
                  <p class="title">{{ todo.codeName }}</p>
                  <p class="descript">{{ todo.rmb }}元 / {{ todo.cost }}金币</p>
                </div>
              </div>
            </div>

            <div class="buyBox">
              <div class="iconImg">
                <el-image :src="item.icoUrl" width="96px" height="140px"></el-image>
              </div>
              <div class="checkItem">{{ item.codeName }}VIP套餐</div>
              <el-button
                type="danger"
                @click="handleBuy({ code: item.code, moneyOff: item.rmb, servicecode: item.code, type: 1 })"
              >购买套餐</el-button>
              <div class="oldPrice">总价值 {{ item.firstRMB }}元/{{ item.firstCost }}金币</div>
              <div class="newPrice">现价 {{ item.rmb }}元/{{ item.cost }}金币</div>
            </div>
          </div>
        </template>
        <!--招聘套餐-->
        <template v-if="serviceType === 2">
          <div class="contextBox2" v-for="item in serve2" :key="item.code">
            <div class="listBox">
              <div class="list_l">
                <div class="postName">{{ item.codeName }}</div>
                <div class="oldPrice">原价 {{ item.firstRMB }}元/{{ item.firstCost }}金币</div>
              </div>
              <div class="list_r">
                <div class="newPrice">{{ item.rmb }}元/{{ item.cost }}金币</div>
                <el-button
                  type="primary"
                  class="companyBg"
                  @click="handleBuy({ code: item.code, moneyOff: item.rmb, servicecode: item.code, type: 2 })"
                >购买</el-button>
              </div>
            </div>
          </div>
        </template>

        <template v-if="serviceType === 3">
          <div class="contextBox2" v-for="item in serve3" :key="item.code">
            <div class="listBox">
              <div class="list_l">
                <div class="postName">{{ item.codeName }}</div>
                <div class="oldPrice">原价 {{ item.firstRMB }}元/{{ item.firstCost }}金币</div>
              </div>
              <div class="list_r">
                <div class="newPrice">{{ item.rmb }}元/{{ item.cost }}金币</div>
                <el-button
                  type="primary"
                  class="companyBg"
                  @click="handleBuy({ code: item.code, moneyOff: item.rmb, servicecode: item.code, type: 2 })"
                >购买</el-button>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div class="right">
        <div class="myGold">
          <div class="cell">
            <span>我的金币</span>
            <div class="more" @click="handleGoldMore">
              <span>明细</span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="goldBox">
            <div class="goldContent">
              <div class="gold">
                <img src="@/assets/images/goldIcon.png" />
              </div>
              <span>{{ wealth }}</span>
            </div>
            <el-button type="danger" @click="handleBuyGold">购买金币</el-button>
          </div>
        </div>

        <div class="userServe">
          <p class="userP">可用服务</p>
          <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="剩余服务" :name="1">
              <div v-for="item in useServe1">{{ item.surplus }}{{ item.unit }}{{ item.codeName }}</div>
            </el-collapse-item>
            <el-collapse-item title="招聘服务" :name="2">
              <div v-for="item in useServe2">{{ item.surplus }}{{ item.unit }}{{ item.codeName }}</div>
            </el-collapse-item>
            <el-collapse-item title="广告服务" :name="3">
              <div v-for="item in useServe3">{{ item.surplus }}{{ item.unit }}{{ item.codeName }}</div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="userServe" style="padding-top: 0;">
          <div class="tcPrice" @click="getPriceCard">
            <span>我的优惠券</span>
            <div>
              <span class="autoText">
                更多
                <i class="el-icon-arrow-right"></i>
              </span>
            </div>
          </div>
          <div class="tcPrice" @click="handleBuyMore">
            <span>购买记录</span>
            <div>
              <span class="autoText">
                更多
                <i class="el-icon-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import payBuy from '@/components/payBuy/index'
import discountCard from '@/components/discountCard/index'
import tabItem from '@/components/tabItem/index'
import Code from "@/api/statusCode";
import { GetPackageService, GetMyGoldInfo, GetMyPackageService, BuyServiceRecord, GetMyCardTicketList, GetServiceInitData, BuyGoldIntroduce } from '@/api/serve'
export default {
  name: "Serve",
  data() {
    return {
      activeNames: [],
      liItem: [{
        id: 1,
        name: "招聘套餐",
      },
      {
        id: 2,
        name: "招聘服务",
      },
      {
        id: 3,
        name: "广告服务",
      }],
      activeItem: 0,
      serviceType: 1,
      serve1: [],     //套餐
      serve2: [],   //招聘服务
      serve3: [],     //广告服务
      dialogTableVisible: false,  //金币明细
      goldData: [],
      pageNo: 1,
      total: 0,
      cardList: [],    //优惠券
      cardTotal: 0,   //优惠券总数量
      pageNoCard: 1,//分页

      serviceType1: 2,  //可用服务
      useServe1: [],
      useServe2: [],
      useServe3: [],

      dialogTableVisible1: false,
      buyData: [],
      pageNo1: 1,   //购买记录
      total1: 0,

      dialogTableVisibleCard: false,   //优惠券

      dialogTableVisiblePay: false,
      paydata: {},  //支付数据

      code: "",//（注： 1、0表示通用券 2、某个服务券对应相应的code 3、-1表示金币券 4、-2表示炒更团券）
      moneyOff: "",
      cardTicketId: 0,//券ID 选了优惠券之后的操作需要传券ID，否则传0给后台
      servicecode: "",//套餐编码
      type: 1,//1：套餐 2：单独服务 3：套餐下的子服务
      tag: true,  //true等于套餐，false等于金币
      wealth: 0   //可用金币

    }
  },
  mounted() {
    this._GetPackageService();//套餐服务

    this._GetMyPackageService(1)   //剩余服务
    this._GetMyPackageService(2)   //剩余服务
    this._GetMyPackageService(3)   //剩余服务
  },
  methods: {
    handleBuyGold() {    //购买金币
      this.tag = false
      this._BuyGoldIntroduce()
    },
    _BuyGoldIntroduce() {
      BuyGoldIntroduce({}).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.paydata = res.data[0];
          this.dialogTableVisiblePay = true
        }
      })
    },
    closedShow() {
      this.dialogTableVisiblePay = false
    },
    handleBuy(data) {    //购买
      let {
        code, moneyOff, servicecode, type
      } = data;
      this.code = code;
      this.moneyOff = moneyOff;
      this.servicecode = servicecode;
      this.type = type;
      this.tag = true  //打开的支付为套餐

      this._GetServiceInitData();

    },
    _GetServiceInitData() {
      let data = {
        code: this.code,    //券code 服务code （注： 1、0表示通用券 2、某个服务券对应相应的code 3、-1表示金币券 4、-2表示炒更团券
        moneyOff: this.moneyOff,
        cardTicketId: this.cardTicketId,
        servicecode: this.servicecode,
        type: this.type
      }
      GetServiceInitData(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.paydata = res.data;
          this.dialogTableVisiblePay = true
        }

      })
    },
    handlePage1(e) {    //购买记录分页
      this.pageNo1 = e;
      this._BuyServiceRecord();
    },
    handlePageCard(e) {   //优惠券分页
      this.pageNoCard = e;
      this._GetMyCardTicketList();
    },
    getPriceCard() {     //获取优惠券
      this.dialogTableVisibleCard = true;
      this._GetMyCardTicketList()
    },
    _GetMyCardTicketList() {
      let data = {
        pageNo: this.pageNoCard
      }
      GetMyCardTicketList(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.cardList = res.data.datas;
          this.cardTotal = res.data.totalCount
        }
      })
    },
    _GetPackageService() {    //获取套餐服务
      let data = {
        serviceType: this.serviceType,
        pageIndex: 1
      }
      if ((this.serviceType == 1 && this.serve1.length == 0) || (this.serviceType == 2 && this.serve2.length == 0) || (this.serviceType == 3 && this.serve3.length == 0)) {
        GetPackageService(data).then(res => {

          if (res.status === Code.SUCCESS_CODE) {
            this.wealth = res.data.wealth
            if (this.serviceType === 1) {
              this.serve1 = res.data.datas
            } else if (this.serviceType === 2) {
              this.serve2 = res.data.datas
            } else if (this.serviceType === 3) {
              this.serve3 = res.data.datas
            }
          }
        })
      }
    },
    checkStatu({ inx, id }) {   //切换TAB
      this.activeItem = inx
      this.serviceType = id;
      this._GetPackageService()
    },
    handleChange(val) {   //手风琴可用服务
      this.serviceType1 = val

    },
    _GetMyGoldInfo() {    //获取金币明细
      let data = {
        pageIndex: this.pageNo
      }
      GetMyGoldInfo(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.goldData = res.data.datas
          this.total = res.data.totalCount
        }

      })
    },
    _GetMyPackageService(type) {   //可用服务
      let data = {
        pageNo: 1,
        serviceType: type
      }
      GetMyPackageService(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          console.log(this)
          if (type === 1) {
            this.useServe1 = res.data.datas;
          } else if (type === 2) {
            this.useServe2 = res.data.datas;
          } else if (type === 3) {
            this.useServe3 = res.data.datas;
          }
        }
      })
    },
    handleBuyMore() {     //购买记录
      this.dialogTableVisible1 = true;
      this._BuyServiceRecord()
    },
    _BuyServiceRecord() {    //服务记录
      let data = {
        pageIndex: this.pageNo1
      }
      BuyServiceRecord(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.buyData = res.data.datas;
          this.total1 = res.data.recordCount
          this.dialogTableVisible1 = true;
        }
      })
    },
    handleGoldMore() {    //金币明细
      this._GetMyGoldInfo()
      this.dialogTableVisible = true
    },
    handlePage(e) {   //金币明细分页
      this.pageNo = e;
      this._GetMyGoldInfo();
    },
  },
  components: { tabItem, discountCard, payBuy },
  filters: {
    typeWay(val) {
      switch (val) {
        case "1":
          return "微信购买金币";
        case "2":
          return "微信购买服务";
        case "3":
          return "支付宝购买金币";
        case "4":
          return "支付宝购买服务";
        case "5":
          return "系统赠送金币";
        case "6":
          return "系统赠送服务";
        case "7":
          return "金币购买服务";
        default:
          return "未知状态";
      }
    }
  }
}
</script>

<style lang="less" scoped>
.contextWrap {
  width: 1200px;
  margin: 0 auto;
  .main {
    margin-top: 30px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    .left {
      flex-basis: 870px;
      max-height: 850px;
      overflow-y: auto;
      .contextBox {
        height: 340px;
        margin-bottom: 20px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 0 0 0 #ccc;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        box-sizing: border-box;
        padding: 30px;
      }
      .serveList {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        height: 280px;
        .listItem1 {
          width: 300px;
          .serveItem {
            padding-bottom: 20px;
            .title {
              font-size: 14px;
              color: #333;
              padding-bottom: 5px;
            }
            .descript {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
      .buyBox {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        .iconImg {
          width: 96px;
          height: 140px;
        }
        .checkItem {
          font-size: 16px;
          font-weight: bold;
          color: #13b5b1;
          padding-top: 5px;
          padding-bottom: 25px;
        }
        .oldPrice {
          padding-top: 30px;
          font-size: 12px;
          color: #999;
          text-decoration: line-through;
        }
        .newPrice {
          font-weight: bold;
          padding-top: 5px;
          font-size: 14px;
          color: #fa6b46;
        }
      }
    }
    .right {
      flex-basis: 320px;
    }
    .myGold {
      background-color: #fff;
      box-sizing: border-box;
      padding: 20px;
      border-radius: 10px;
    }
    .cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #666;
      font-size: 16px;
      .more {
        font-size: 12px;
        cursor: pointer;
      }
    }
    .goldBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 50px 0 10px;
      font-size: 40px;
      line-height: 40px;
      color: #fa6b46;
    }
  }
  .userServe {
    margin-top: 20px;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    p {
      color: #666;
      font-size: 16px;
      padding-bottom: 20px;
    }
  }
  .tcPrice {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    line-height: 40px;
    span {
      color: #333;
      font-size: 14px;
    }
    .autoText {
      font-size: 12px;
      color: #999;
      cursor: pointer;
    }
  }
}
.contextBox2 {
  .listBox {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
    .postName {
      font-size: 16px;
      color: #333;
      padding-bottom: 10px;
    }
    .oldPrice {
      font-size: 14px;
      color: #999;
      text-decoration: line-through;
    }
    .list_r {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .newPrice {
        color: #fa6b46;
        font-size: 16px;
        margin-right: 20px;
      }
    }
  }
}
.cardBox {
  background-color: #f8f9fb;
  padding: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.goldContent {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
}
.gold {
  margin-right: 5px;
  padding-bottom: 5px;
  width: 20px;
  height: 20px;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.cardContent {
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>