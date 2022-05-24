<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>{{ title }}</span>
      <span slot="footer" class="dialog-footer">
        <template v-if="dialogType">
          <el-button @click="_UpdateJobStatus('pt')">开启普通职位</el-button>
          <el-button type="primary" @click="_UpdateJobStatus('jp')">开启精品职位</el-button>
        </template>
        <template v-else>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" v-if="dialogTag === 1" @click="confirmPay">确 定</el-button>
          <el-button type="primary" v-else @click="confirmReturn">确 定</el-button>
        </template>
      </span>
    </el-dialog>
    <div class="listWrap" v-for="item in arrayData" :key="item.id">
      <div class="positionName">
        <div class="name">
          <template v-if="flag">
            <span :class="item.postStatus == '1' ? 'greenColor' : 'garyColor'">{{ item.postName }}</span>
            <span v-if="item.serviceCode === '1002'" class="competitive">精</span>
          </template>
          <template v-else>
            <span :class="item.status == 3 ? 'greenColor' : 'garyColor'">{{ item.hiringPost }}</span>
            <span class="competitive greenBordr">{{ item.clearingForm }}</span>
          </template>
        </div>
        <div class="positionItem">
          <template v-if="flag">
            <span>{{ item.postCity | sliceCity }}</span>
            <span>{{ item.experienceYear }}</span>
            <span>{{ item.academicRequirements }}</span>
            <span>{{ item.payroll }}</span>
          </template>
          <template v-else>
            <span>{{ item.detailedAddress }}</span>
            <span>{{ item.minPay }}-{{ item.maxPay }} {{ item.wageType }}</span>
          </template>
        </div>
      </div>

      <div class="informationBox">
        <div class="itemBoxs" @click="flag ? handleUnknow(1) : handlejz(item.groupId)">
          <div>{{ flag ? item.noReadCount : item.applyCount }}</div>
          <div class="inforTitle">{{ flag ? '未阅读' : '已报名' }}</div>
        </div>
        <div class="itemBoxs" @click="flag ? handleUnknow(3) : handlejz(item.groupId)">
          <div>{{ flag ? item.interviewCount : item.canApplyCount }}</div>
          <div class="inforTitle">{{ flag ? '面试' : '可报名' }}</div>
        </div>
        <div class="itemBoxs" @click="flag ? handleUnknow(4) : handlejz(item.groupId)">
          <div>{{ flag ? item.candidateCount : item.hiringNumber }}</div>
          <div class="inforTitle">{{ flag ? '候选人' : '招聘人数' }}</div>
        </div>
      </div>

      <div class="statuBox">
        <template v-if="flag">
          <div class="statu">
            <div class="point" :class="item.postStatus == '1' ? 'green' : 'gary'"></div>
            <div
              :class="item.postStatus == '1' ? 'greenColor' : 'garyColor'"
            >{{ item.postStatus | changeStatu }}</div>
          </div>
          <div class="endTime">{{ item.deadline }}到期</div>
        </template>
        <template v-else>
          <div class="statu">
            <div class="point" :class="item.status == 3 ? 'green' : 'gary'"></div>
            <div :class="item.status == 3 ? 'greenColor' : 'garyColor'">{{ item.status | statu }}</div>
          </div>
          <div
            class="endTime"
          >{{ item.startRecruitmentCycle.split(' ')[0] }} 至 {{ item.endRecruitmentCycle.split(' ')[0] }}</div>
        </template>
      </div>

      <div class="btnsBox">
        <template v-if="flag">
          <el-popconfirm
            v-if="item.postStatus == '1'"
            title="关闭职位后再次启用时，将扣减职位发布数，是否继续？"
            @confirm="handleDownUp(item.id, item.serviceCode, item.postStatus)"
          >
            <span slot="reference">下线</span>
          </el-popconfirm>
          <span v-else @click="handleUp(item.id, item.serviceCode, item.postStatus)">上线</span>
          <span @click="handleEdit(item.id)">编辑</span>
          <el-dropdown @command="handleMore">
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-show="item.serviceCode === '1001'"
                :command="{ id: item.id, statu: item.postStatus, flag: 'return' }"
              >转精品</el-dropdown-item>
              <el-dropdown-item :command="{ id: item.id, flag: 'refresh' }">刷新</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else>
          <el-popconfirm
            v-if="item.status == 2 && item.isPastDue"
            title="确定上架此炒更团吗？"
            @confirm="handlePartUp(item.groupId)"
          >
            <span slot="reference">上架</span>
          </el-popconfirm>
          <el-popconfirm
            v-if="item.status == 3"
            title="确定此炒更团完成招募吗？"
            @confirm="handlePartOver(item.groupId)"
          >
            <span slot="reference">完成</span>
          </el-popconfirm>
          <el-popconfirm
            v-if="item.status == 3 || item.status == 2"
            title="确定要关闭此炒更团吗？"
            @confirm="handlePartClosed(item.groupId)"
          >
            <span slot="reference">关闭</span>
          </el-popconfirm>
          <!--炒更按钮-->
        </template>
      </div>
    </div>
    <el-dialog title="支付购买" :visible.sync="dialogTableVisiblePay" @close="closedShow">
      <pay-buy
        :paydata="paydata"
        :type="flag ? 1 : 3"
        :groupId="groupId"
        @closedShow="closedShow"
        :otherPosition="otherPosition"
        :fucktype="fucktype"
        ref="pay"
      ></pay-buy>
    </el-dialog>
  </div>
  <!--我只是想-->
</template>
<script>
import payBuy from '@/components/payBuy/index'
import {
  UpdateJobStatus,
  CommonConvertBoutiqueJob,
  RefreshJob,
  GetPostNum
} from '@/api/positionManagement'
import {
  WithGroupPtaway,
  FinishRecruit,
  CloseWithGroup,
  ServicePayInit,
} from '@/api/timeJob'
//import { Loading, Message } from "element-ui"; // 引用element-ui的加载和消息提示组件
import Code from "@/api/statusCode";
export default {
  data() {
    return {
      serviceSurplus1002: 0,      //精品职位个数
      serviceSurplus1001: 0,     //普通职位个数
      dialogVisible: false,      //转精品弹窗
      command: {},     //当前职位的参数对象
      title: "",   //弹窗提示
      dialogTag: 0,//0代表点击确认是开启精品职位按钮，1代表付费购买
      dialogType: 0,   //弹窗类型，如果为1，代表是开启职位时，可选精品和普通
      groupId: 0,   //炒更ID
      dialogTableVisiblePay: false,
      paydata: {},  //支付信息
      positionId: 0,  //职位ID
      curPositionStatus: "",  //招聘职位状态码，注意改状态为当前状态，不是修改后的状态(1:开启招聘，2：关闭招聘)
      serviceCode: "",
      fucktype: -1  //1职位上线；2转精品；-1其他
    }
  },
  props: {
    arrayData: {
      type: Array,
      default: function () {
        return [];
      }
    },
    flag: {     //1代表职位   0代表炒更
      type: Boolean,
      default: true
    }
  },
  components: { payBuy },
  mounted() {
    console.log(this.arrayData);
  },
  methods: {
    handlePartClosed(id) {     //关闭招募
      this.groupId = id
      this._CloseWithGroup()
    },
    _CloseWithGroup() {     //关闭团
      let data = {
        groupId: this.groupId
      }
      CloseWithGroup(data).then(res => {
        this.groupId = ''
        if (res.status === Code.SUCCESS_CODE) {
          this.$emit('refresh')
          this.$message({
            message: '关闭成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },

    handlePartUp(id) {     //上架炒更
      this.groupId = id;
      this._WithGroupPtaway()

    },

    _WithGroupPtaway() {  //上架炒更接口
      let data = {
        groupId: this.groupId
      }
      WithGroupPtaway(data).then(res => {


        if (res.status === Code.SUCCESS_CODE) {
          this.$emit('refresh')
          this.groupId = ''
          this.$message({
            message: '上架成功',
            type: 'success'
          });
        } else if (res.status === 1007) {     //去支付

          this._ServicePayInit();
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },

    handlePartOver(id) {   //完成招募
      this.groupId = id
      this._FinishRecruit()
    },
    _FinishRecruit() {
      let data = {
        groupId: this.groupId
      }
      FinishRecruit(data).then(res => {
        this.groupId = ''
        if (res.status === Code.SUCCESS_CODE) {
          this.$emit('refresh')
          this.$message({
            message: '完成招募',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    handlejz(id) {   //兼职
      this.$emit('openJz', id)
    },
    /*--------------------------------------炒更团方法--------------------------------------*/
    _ServicePayInit() {     //炒更，职位初始化数据

      let data = {
        businesstype: this.flag ? 'Service' : 'WithGroup',
        serviceCode: this.flag ? this.serviceCode : '',    //服务码(1001普通职位；1002精品职位)
        groupId: this.groupId || 0,
      }
      ServicePayInit(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          if (this.flag) {   //职位
            this.paydata = res.data[0]
          } else {    //炒更
            this.paydata = res.data
          }
          this.dialogVisible = false;
          this.dialogTableVisiblePay = true

          if (this.$refs.pay) {      //当组件还没有渲染的时候，pay会undefiend,组件渲染时，会自动执行_ServiceOrGoldPayment() 所以不用调用
            this.$refs.pay._ServiceOrGoldPayment()      //弹窗只是显示隐藏，导致不会触发组件mounted的钩子函数，所以显示时，调用子组件获取二维码方法
          }

        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    closedShow() {      //关闭支付弹窗
      this.dialogTableVisiblePay = false;
      this.$refs.pay.clearTimer()   //清除子组件的定时器
      
      this.$emit('refresh')
    },
    /*--------------------------------------职位炒更共用方法--------------------------------------*/

    handleUnknow(e) {     //职位未阅读 
      this.$router.push({
        name: "Resume", query: {
          status: e
        }
      })
    },

    handleMore(command) {   //点击了更多
      if (command instanceof Object && command.flag == 'refresh') {   //刷新
        let data = {
          id: command.id,
          curPageStatus: 1   //只有开启的职位才会有刷新
        }
        RefreshJob(data).then(res => {
          if (res.status === Code.SUCCESS_CODE) {
            this.$message({
              message: '刷新成功！',
              type: 'success'
            });
            this.$emit('refresh')
          }
        })
      } else if (command instanceof Object && command.flag == 'return') {    //转精品

        this.positionId = command.id
        this.fucktype = 2   //转精品
        GetPostNum({}).then(res => {
          if (res.status === Code.SUCCESS_CODE) {
            this.serviceCode = '1002';

            this.serviceSurplus1001 = res.data.serviceSurplus1001;
            this.serviceSurplus1002 = res.data.serviceSurplus1002;
            if (res.data.serviceSurplus1002 == 0) {     //代表没有转精品的资格
              this.title = `您的精品职位额度不足，可购买后继续~`
              this.dialogTag = 1;
            } else {
              this.title = `您的精品职位还剩${this.serviceSurplus1002}次,此操作会扣减1次额度,确认继续?`
              this.command = command;
              this.dialogTag = 0;
            }
            this.dialogType = 0
            this.dialogVisible = true;
          }
        })
      }
    },

    confirmReturn() {      //确认转精品
      let data = {
        jobId: this.command.id
      }

      CommonConvertBoutiqueJob(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.dialogVisible = false;    //刷新弹窗内容
          this.command = {}
          this.$emit('refresh')
        } else {
          this.$message({     //转精品失败
            message: res.message,
            type: 'warning'
          });
        }
      })
    },

    handleEdit(e) {   //编辑职位
      this.$router.push({ name: "PostJob", query: { id: e } })
    },

    handleDownUp(e, s, t) {//下线职位  
      this.positionId = e;
      this.curPositionStatus = t;
      this.serviceCode = s;

      this._UpdateJobStatus()

    },
    _UpdateJobStatus(e) {   //e如果有值，代表是开启的普通职位或者精品

      if (e == 'pt') {
        this.serviceCode = '1001'
      } else if (e == 'jp') {
        this.serviceCode = '1002'
      }
      let data = {
        id: this.positionId,
        curPositionStatus: this.curPositionStatus,      //状态为1的时候是上线
        serviceCode: this.serviceCode
      }
      UpdateJobStatus(data).then(res => {

        if (res.status === Code.SUCCESS_CODE) {

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.$emit('refresh')
        } else {    //操作失败则支付


          this._ServicePayInit()
        }
        this.dialogVisible = false;
      })
    },

    handleUp(e, s, t) {   //上线职位

      this.fucktype = 1   //职位上线
      this.positionId = e;
      this.curPositionStatus = t;
      this.serviceCode = s;
      this._GetPostNum()
    },
    _GetPostNum() {
      GetPostNum({}).then(res => {
        if (res.status === Code.SUCCESS_CODE) {

          this.serviceSurplus1001 = res.data.serviceSurplus1001;
          this.serviceSurplus1002 = res.data.serviceSurplus1002;
          if (res.data.serviceSurplus1002 == 0 && this.serviceSurplus1001 == 0) {     //代表没有服务

            this.title = `您的精品职位和普通职位额度不足，可购买后继续~`
            this.dialogType = 1
            this.dialogTag = 0
          } else if (res.data.serviceSurplus1002 == 0 && this.serviceCode == '1002') {    //精品职位
            //还剩普通职位
            this.title = `您的精品职位额度不足，可购买后继续~`
            this.dialogTag = 1
          } else if (res.data.serviceSurplus1001 == 0 && this.serviceCode == '1001') {    //普通职位
            //还剩普通职位
            this.title = `您的普通职位额度不足，可购买后继续~`
            this.dialogTag = 1
          } else {
            this.dialogTag = 0
            this.dialogType = 1
            this.title = `您目前还剩${this.serviceSurplus1002}个精品职位,${this.serviceSurplus1001}个普通职位,请选择开启普通职位还是精品职位`
          }
          this.dialogVisible = true;
        }
      })
    },
    confirmPay() {     //服务不足时弹支付
      this._ServicePayInit()
    },
    /*--------------------------------------职位方法--------------------------------------*/

  },
  computed: {
    otherPosition() {
      return {
        positionId: this.positionId,
        serviceCode: this.serviceCode,
        postStatus: 1//(1开启，2关闭)
      }
    },   //纯粹为了调接口
  },
  filters: {
    sliceCity(str) {
      if (str) {
        let arr;
        arr = str.split(' ')
        return arr[0] || ''
      } else {
        return ''
      }
    },
    statu(val) {
      switch (val) {
        case 1:
          return "提交待审核";
        case 2:
          return "审核通过";
        case 3:
          return "招募中";
        case 4:
          return "审核未通过";
        case 5:
          return "违规下架";
        case 6:
          return "招募完成";
        case 7:
          return "自主关闭";
        default:
          return "未知状态";
      }
    },
    changeStatu(val) {
      switch (val) {
        case '0':
          return "审核中";
        case "1":
          return "已发布";
        case '2':
          return "已截止";
        case "3":
          return "已删除";
        default:
          return "未知状态";
      }
    }
  }

}
</script>
<style lang="less" scoped>
.listWrap {
  display: flex;
  box-sizing: border-box;
  padding: 20px;
  align-items: center;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-top: 20px;
}
.positionName {
  flex-basis: 400px;
  color: #999;
  font-size: 14px;
  margin-right: 20px;
}
.name {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #0f0f0f;
  padding-bottom: 20px;
}
.positionItem > span {
  margin-right: 20px;
}
.informationBox {
  flex-basis: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.itemBoxs {
  cursor: pointer;
  text-align: center;
  font-size: 18px;
  color: #0f0f0f;
  &:hover {
    color: #13b5b1;
  }
}
.inforTitle {
  padding-top: 14px;
  font-size: 14px;
  color: #666;
}

.statuBox {
  flex-basis: 120px;
  font-size: 14px;
  color: #000;
  margin-left: 20px;
  flex-basis: 200px;
}

.statu {
  display: flex;
  align-items: center;
}
.endTime {
  font-size: 12px;
  color: #999;
  padding-top: 20px;
}
.point {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  margin-right: 10px;
}
.green {
  background-color: #13b5b1;
}
.greenColor {
  color: #333;
}
.gary {
  background-color: #999;
}
.garyColor {
  color: #999;
}
.btnsBox {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  font-size: 16px;
  color: #13b5b1;
}
.btnsBox > span {
  cursor: pointer;
  margin-right: 20px;
}
.competitive {
  display: inline-block;
  font-size: 12px;
  color: #e8a228;
  border: 1px solid #e8a228;
  margin-left: 6px;
  padding: 2px;
  border-radius: 3px;
}
.greenBordr {
  border: 1px solid #13b5b1;
  color: #13b5b1;
}
</style>