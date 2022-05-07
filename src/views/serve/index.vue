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
        class="fyDiv"
        @current-change="handlePage"
      ></el-pagination>
    </el-dialog>

    <el-dialog title="购买记录" :visible.sync="dialogTableVisible1">
      <el-table :data="buyData">
        <el-table-column property="createDateTime" label="类型"></el-table-column>
        <el-table-column property="goldType" label="时间"></el-table-column>
        <el-table-column property="inOrOut" label="方式"></el-table-column>
        <el-table-column property="goldType" label="金额"></el-table-column>
        <el-table-column property="inOrOut" label="数量"></el-table-column>
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

    <el-dialog title="优惠券" :visible.sync="dialogTableVisible2">
      <div class="cardBox">
        <discount-card></discount-card>
      </div>
    </el-dialog>

    <el-dialog title="支付购买" :visible.sync="dialogTableVisible5">
      <pay-buy :paydata="paydata"></pay-buy>
    </el-dialog>
    <tab-item :liItem="liItem" @checkStatu="checkStatu"></tab-item>
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
                @click="handleBuy({ code: 1, moneyOff: item.rmb, cardTicketId: 0, servicecode: item.code, type: 1 })"
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
                <el-button type="primary" class="companyBg">购买</el-button>
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
                <el-button type="primary" class="companyBg">购买</el-button>
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
            <div>
              <i class="el-icon-arrow-right"></i>
              <span>521</span>
            </div>
            <el-button type="danger">购买金币</el-button>
          </div>
        </div>

        <div class="userServe">
          <p class="userP">可用服务</p>

          <!-- <div class="tcPrice">
            <span>招聘套餐</span>
            <div>
              <span class="autoText">
                银牌套餐
                <i class="el-icon-arrow-right"></i>
              </span>
            </div>
          </div>-->
          <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="招聘套餐" :name="1">
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
import { GetPackageService, GetMyGoldInfo, GetMyPackageService, BuyServiceRecord, GetMyCardTicketList, GetServiceInitData } from '@/api/serve'
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
      serviceType: 1,
      serve1: [],     //套餐
      serve2: [],   //招聘服务
      serve3: [],     //广告服务
      dialogTableVisible: false,  //金币明细
      goldData: [],
      pageNo: 1,
      total: 0,

      serviceType1: 2,  //可用服务
      useServe1: [],
      useServe2: [],
      useServe3: [],

      dialogTableVisible1: false,
      buyData: [],
      pageNo1: 1,
      total1: 0,

      dialogTableVisible2: false,   //优惠券

      dialogTableVisible5: false,
      paydata: {}  //支付数据
    }
  },
  mounted() {
    this._GetPackageService();
    // for (let i = 1; i < 4; i++) {
    //   this.serviceType1 = i
    //   this._GetMyPackageService()
    // }
    this._GetMyPackageService()
  },
  methods: {
    handleBuy(data) {    //购买

      this._GetServiceInitData(data);
      this.dialogTableVisible5 = true
    },
    _GetServiceInitData(data) {
      let {
        code, moneyOff, cardTicketId, servicecode, type
      } = data
      let datas = {
        code,
        moneyOff,
        cardTicketId,
        servicecode,
        type
      }
      GetServiceInitData(datas).then(res => {
        debugger
        this.paydata = res.data
      })
    },
    handlePage1() {    //购买记录分页

    },
    getPriceCard() {     //获取优惠券
      this.dialogTableVisible2 = true;
      this._GetMyCardTicketList()
    },
    _GetMyCardTicketList() {
      let data = {
        pageNo: 1
      }
      GetMyCardTicketList(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          debugger
        }
      })
    },
    _GetPackageService() {
      let data = {
        serviceType: this.serviceType,
        pageIndex: 1
      }
      if ((this.serviceType == 1 && this.serve1.length == 0) || (this.serviceType == 2 && this.serve2.length == 0) || (this.serviceType == 3 && this.serve3.length == 0)) {
        GetPackageService(data).then(res => {
          if (res.status === Code.SUCCESS_CODE) {
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
    checkStatu(e) {   //切换TAB
      this.serviceType = e;
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
    _GetMyPackageService() {   //可用服务
      let data = {
        pageNo: 1,
        serviceType: this.serviceType1
      }
      GetMyPackageService(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          console.log(this)
          debugger
          if (this.serviceType1 === 1) {
            this.useServe1 = res.data.datas;
          } else if (this.serviceType1 === 2) {
            this.useServe2 = res.data.datas;
          }
        }
      })
    },
    handleBuyMore() {
      this.dialogTableVisible1 = true;
      this._BuyServiceRecord()
    },
    _BuyServiceRecord() {    //服务记录
      let data = {
        pageIndex: 1
      }
      BuyServiceRecord(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          debugger
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
  components: { tabItem, discountCard, payBuy }
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
      color: #fa6b46;
      font-weight: bold;
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
}
</style>