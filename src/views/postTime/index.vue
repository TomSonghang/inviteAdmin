<template>
  <div class="contextWrap postWrap">
    <el-dialog title="选择职位" :visible.sync="dialogVisible" width="50%">
      <div class="radioContext">
        <div v-for="item in positionList" class="radioBox">
          <el-radio v-model="radio" :label="item.postName">{{ item.postName }}</el-radio>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRadio">确 定</el-button>
      </span>
    </el-dialog>
    <div>
      <div class="titleBox">
        <div class="title">基本信息</div>
        <p class="descript">职位名称和职位类型发布后不可修改，请准确填写</p>
      </div>
      <div class="inputBox">
        <div class="itemBox">
          <div class="itemTitle">炒更名称</div>
          <div class="inputWidth">
            <el-input v-model="hiringPost" placeholder="请输入炒更名称">
              <template slot="append">
                <i class="el-icon-arrow-down" @click="checkPosition"></i>
              </template>
            </el-input>
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
        <div class="itemBox">
          <div class="itemTitle">省市区</div>
          <div>
            <el-cascader
              v-model="postCitys"
              class="inputWidth"
              placeholder="省市区，可搜索"
              :options="cityData"
              :props="{ value: 'label' }"
              filterable
            ></el-cascader>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">详细地点</div>
          <div class="inputWidth">
            <el-input v-model="detailedAddress" placeholder="详细地点" @blur="changeAddress"></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">地图标注</div>
          <template>
            <baidu-map
              @ready="handler"
              class="bm-view"
              :center="center"
              :zoom="zoom"
              :scroll-wheel-zoom="true"
            >
              <bm-marker
                :position="{ lng: center.lng, lat: center.lat }"
                :dragging="true"
                animation="BMAP_ANIMATION_BOUNCE"
                @dragend="dragend"
              >
                <bm-label
                  content="职位的工作地址"
                  :labelStyle="{ color: '#13b5b1', fontSize: '14px' }"
                  :offset="{ width: -35, height: 30 }"
                />
              </bm-marker>
            </baidu-map>
          </template>
        </div>
        <div class="itemBox">
          <div class="itemTitle">经纬度</div>
          <div class="inputWidth1">
            <el-input v-model="center.lng" placeholder="经度"></el-input>
          </div>
          <div class="inputWidth1">
            <el-input v-model="center.lat" placeholder="纬度"></el-input>
          </div>
        </div>
        <div class="mar120">
          <el-button type="primary" class="companyBg" @click="handleCreate">发布兼职</el-button>
          <p v-show="coldPrice.RMBPrice" class="titlePrice">
            该兼职根据您选择的截止时间，需要支付人民币
            <span>
              {{
                coldPrice.RMBPrice
              }}
            </span> 元或者
            <span>{{ coldPrice.GoldPrice }}</span>金币
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cityData from '@/utils/city'
import fixData from '@/mixins/getfixData'
import Code from "@/api/statusCode";
import { CreateWithGroup, GetJobOffers, GetWithGroupPriceByEndDateTime } from '@/api/postTime'
export default {
  name: "PostJob",
  data() {
    return {
      userTime: [],   //用工周期
      endDateTime: '',//截止日期

      hiringPost: "",  //炒更名称


      hiringNumber: "",//招聘人数
      minPay: '',   //最小薪资
      maxPay: "",   //最大薪资
      clearingForm: "日结",//结算方式
      jobTypeOption: ['日结', '周结', '月结', '完工结'],

      phone: "",//电话


      postCitys: [],//省市区
      detailedAddress: "",//详细地址
      laborRequire: "",  //用工需求

      wageType: "元/月",
      priceOptions: [
        '元/小时',
        '元/日',
        '元/月',
        '元/年'
      ],

      positionList: [],   //职位列表
      dialogVisible: false,
      radio: "",
      coldPrice: {
        RMBPrice: "",
        GoldPrice: ""
      },
      cityData: cityData,
      center: { lng: 114.132542, lat: 22.579092 },//经纬度
      zoom: 18, //地图展示级别
      BMap: null
    }
  },
  mixins: [fixData],
  mounted() { },
  watch: {
    endDateTime() {
      this._GetWithGroupPriceByEndDateTime()
    }
  },
  computed: {

    postArray() {
      let data = JSON.stringify(this.fixJobtypeList)
      data = data.replace(/name/g, 'label').replace(/dataId/g, 'value').replace(/jobtype/g, 'children')
      return JSON.parse(data)
    },
    address() {
      let postCitys = '';
      if (this.postCitys.length > 0) {  //地址
        postCitys = this.postCitys.join('-')
      }
      return `${postCitys} ${this.detailedAddress}`  //'深圳市罗湖区水贝金座大厦'
    }
  },
  methods: {
    _GetWithGroupPriceByEndDateTime() {
      let data = {
        endDateTime: this.endDateTime
      }
      GetWithGroupPriceByEndDateTime(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.coldPrice = res.data
        }
      })
    },
    checkPosition() {
      this._GetJobOffers()
    },
    _GetJobOffers() {
      let data = {
        PostStatus: "",
        PageIndex: 1,
      }
      GetJobOffers(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.positionList = res.data.datas;
          this.dialogVisible = true
        }
      })
    },
    handleRadio() {
      //确认选择职位
      this.hiringPost = this.radio;
      this.positionList.forEach(item => {
        if (item.postName == this.radio) {

          let arr = item.postCity.split(' ')
          let city = arr[0].split('-')
          this.postCitys = city;
          this.detailedAddress = arr[1];
          this.hiringNumber = item.hiring;
          this.phone = item.postPhone
          this.changeAddress()
        }
      })
      this.dialogVisible = false
    },
    handler({ BMap }) {   //地图
      this.BMap = BMap
    },
    dragend({ point }) {
      this.center = {
        lng: point.lng,
        lat: point.lat
      }
    },
    changeAddress() {
      let that = this;
      let BMap = this.BMap
      let myGeo = new BMap.Geocoder();
      myGeo.getPoint(that.address, function (point) {
        if (point) {
          that.center = {
            lng: point.lng,
            lat: point.lat
          }
        } else {
          alert('您选择的地址没有解析到结果！');
        }
      })
    },
    handleCreate() {
      this.$confirm('兼职炒更创建成功审核通过后，需要您执行上架操作之后才能成功发布哦~', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._CreateWithGroup()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        });
      });
    },
    _CreateWithGroup() {
      let postCitys = '';
      if (this.postCitys.length > 0) {  //地址
        postCitys = this.postCitys.join('-')
      }
      let data = {
        hiringPost: this.hiringPost, //招聘职位
        hiringNumber: this.hiringNumber,//招聘数量
        minPay: this.minPay || 0,//最小薪资
        maxPay: this.maxPay || 0,//最大
        wageType: this.wageType,//工资类型
        clearingForm: this.clearingForm,//结算方式
        detailedAddress: `${postCitys} ${this.detailedAddress}`,//详细地址
        longitude: this.center.lng,//福利待遇
        latitude: this.center.lat,//工作经验（如："1-3年经验"

        phone: this.phone,//公司招聘邮箱
        startRecruitmentCycle: this.userTime[0],//开始招聘周期
        endRecruitmentCycle: this.userTime[1],//结束招聘周期
        endDateTime: this.endDateTime,//截止日期
        laborRequire: this.laborRequire,//用工要求

      }
      if (!this.hiringPost || !this.hiringNumber || !this.wageType || !this.maxPay || !this.minPay || !this.clearingForm || !postCitys || !this.detailedAddress || !this.center.lng || !this.center.lat || !this.phone || !this.userTime[0] || !this.userTime[1] || !this.endDateTime || !this.laborRequire) {
        this.$message({
          message: '请检查输入信息是否完整~',
          type: 'warning'
        });
        return
      }
      CreateWithGroup(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.$router.back()
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

<style lang="less">
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
  color: #666;
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

.mar120 {
  margin-left: 120px;
}
.bm-view {
  width: 500px;
  height: 300px;
}
.inputWidth1 {
  width: 170px;
  margin-right: 20px;
}
.postWrap {
  background-color: #fff !important;
}
.radioContext {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.radioBox {
  margin-right: 20px;
  margin-bottom: 10px;
}
.titlePrice {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  span {
    font-size: 14 px;
    color: #ff7606;
    font-weight: bold;
    margin: 0 4px;
  }
}
</style>