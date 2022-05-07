<template>
  <div class="contextWrap">
    <div>
      <div class="titleBox">
        <div class="title">基本信息</div>
        <p class="descript">职位名称和职位类型发布后不可修改，请准确填写</p>
      </div>
      <div class="inputBox">
        <div class="itemBox">
          <div class="itemTitle">炒更名称</div>
          <div class="inputWidth">
            <el-input v-model="hiringPost" placeholder="请输入炒更名称"></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">招聘人数</div>
          <div class="inputWidth">
            <el-input v-model="hiringNumber" placeholder="请输入招聘人数"></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">薪资范围</div>
          <div class="priceBox">
            <div class="priceRule">
              <el-input v-model="minPay" placeholder="最低薪资"></el-input>
            </div>
            <div class="priceRule">
              <el-input v-model="maxPay" placeholder="最高薪资"></el-input>
            </div>
            <div class="priceRule">
              <el-select v-model="wageType" placeholder="请选择">
                <el-option v-for="item in priceOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">结算方式</div>
          <div>
            <el-select v-model="clearingForm" placeholder="请选择" class="inputWidth">
              <el-option v-for="item in jobTypeOption" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">用工周期</div>
          <div>
            <el-date-picker
              v-model="userTime"
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">截止日期</div>
          <el-date-picker
            class="inputWidth"
            v-model="endDateTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          ></el-date-picker>
        </div>

        <div class="itemBox">
          <div class="itemTitle">联系电话</div>
          <div class="priceBox">
            <div class="inputWidth">
              <el-input v-model="phone" placeholder="联系电话"></el-input>
            </div>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">省市区</div>
          <div>
            <el-cascader
              popper-class="casClass"
              class="inputWidth"
              placeholder="省市区，可搜索"
              :options="cityData"
              filterable
            ></el-cascader>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">详细地点</div>
          <div class="inputWidth">
            <el-input v-model="detailedAddress" placeholder="详细地点"></el-input>
          </div>
        </div>
        <div class="itemBox">
          <div class="itemTitle">用工要求</div>
          <div class="inputWidth2">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              v-model="laborRequire"
              placeholder="请输入任职要求"
            ></el-input>
          </div>
        </div>

        <el-button type="primary" class="companyBg mar120" @click="handleCreate">发布兼职</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import cityData from '@/utils/city'
import fixData from '@/mixins/getfixData'
import Code from "@/api/statusCode";
import { CreateWithGroup } from '@/api/postTime'
export default {
  name: "PostJob",
  data() {
    return {
      userTime: [],   //用工周期
      endDateTime: '',//截止日期



      hiringPost: "",//岗位名称
      hiringNumber: "",//招聘人数
      minPay: '',   //最小薪资
      maxPay: "",   //最大薪资
      clearingForm: "日结",//结算方式
      jobTypeOption: ['日结', '周结', '月结', '完工结'],

      phone: "",//电话
      longitude: 116.408,//经度
      latitude: 39.9141,//纬度

      detailedAddress: "",//详细地址
      laborRequire: "",  //用工需求

      wageType: "元/月",
      priceOptions: [
        '元/小时',
        '元/日',
        '元/月',
        '元/年'
      ],


      cityData: cityData
    }
  },
  mixins: [fixData],
  mounted() { },
  computed: {
    postArray() {
      let data = JSON.stringify(this.fixJobtypeList)
      data = data.replace(/name/g, 'label').replace(/dataId/g, 'value').replace(/jobtype/g, 'children')
      return JSON.parse(data)
    }
  },
  methods: {
    handleCreate() {
      this._CreateWithGroup()
    },
    _CreateWithGroup() {
      let data = {
        hiringPost: this.hiringPost, //招聘职位
        hiringNumber: this.hiringNumber,//招聘数量
        minPay: this.minPay || 0,//最小薪资
        maxPay: this.maxPay || 0,//最大
        wageType: this.wageType,//工资类型
        clearingForm: this.clearingForm,//结算方式
        detailedAddress: this.detailedAddress,//详细地址
        longitude: this.longitude,//福利待遇
        latitude: this.latitude,//工作经验（如："1-3年经验"

        phone: this.phone,//公司招聘邮箱
        startRecruitmentCycle: this.userTime[0],//开始招聘周期
        endRecruitmentCycle: this.userTime[1],//结束招聘周期
        endDateTime: this.endDateTime,//截止日期
        laborRequire: this.laborRequire,//用工要求

      }
      CreateWithGroup(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: res.message,
            type: "success",
          });
        } else {
          this.$message({
            message: res.message,
            type: "warning",
          });
        }
      })
    }
  }
}
</script>

<style>
.contextWrap {
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
}
.title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}
.descript {
  font-size: 14px;
  color: #999;
  padding-top: 10px;
}
.titleBox {
  margin-bottom: 40px;
}
.itemBox {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
  align-items: center;
  color: #999;
  font-size: 14px;
}
.itemTitle {
  flex-basis: 100px;
  margin-right: 20px;
  display: flex;
  justify-content: flex-end;
}
.priceBox {
  display: flex;
  align-items: center;
}
.priceRule {
  width: 120px;
  margin-right: 10px;
}
.inputWidth {
  width: 380px;
}
.inputWidth2 {
  width: 500px;
}
.partTwo {
  margin-top: 50px;
}
.casClass {
  height: 300px;
  overflow-y: auto;
}
.mar120 {
  margin-left: 120px;
}
</style>