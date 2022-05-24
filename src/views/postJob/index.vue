<template>
  <div class="contextWrap postWrap">
    <div>
      <div class="titleBox">
        <div class="title">基本信息</div>
        <p class="descript">职位名称和职位类型发布后不可修改，请准确填写</p>
      </div>
      <div class="inputBox">
        <div class="itemBox">
          <div class="itemTitle">发布类型</div>
          <div>
            <el-select
              v-model="serviceCode"
              placeholder="请选择"
              class="inputWidth"
              :disabled="action == 'edit'"
              @visible-change="handleShoweAction"
              @change="handleChangeAction"
            >
              <el-option v-for="item in postTypeOption" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
         <p v-show="action == 'edit' && serviceCode == '普通职位'">如需转精品可在职位管理列表里操作哦~</p>
        </div>

        <div class="itemBox">
          <div class="itemTitle">招聘类型</div>
          <div>
            <el-select v-model="jobType" placeholder="请选择" class="inputWidth">
              <el-option v-for="item in jobTypeOption" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">职位名称</div>
          <div class="inputWidth">
            <el-input
              v-model="postName"
              placeholder="请输入职位名称"
              :disabled="action == 'add' ? false : true"
            ></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">职位人数</div>
          <div class="inputWidth">
            <el-input v-model="hiring" placeholder="请输入职位人数"></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">职位类型</div>
          <div>
            <el-cascader
              v-model="postType"
              class="inputWidth"
              :disabled="action == 'add' ? false : true"
              placeholder="职位分类，可搜索"
              :options="postArray"
              :props="{
                value: 'label'
              }"
              filterable
            ></el-cascader>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">薪资范围</div>
          <div class="priceBox">
            <div class="priceRule">
              <el-input v-model="minPrice" placeholder="最低薪资"></el-input>
            </div>
            <div class="priceRule">
              <el-input v-model="maxPrice" placeholder="最高薪资"></el-input>
            </div>
            <div class="priceRule">
              <el-select v-model="checkPrice" placeholder="请选择">
                <el-option v-for="item in priceOptions" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--第二部分-->
    <div class="partTwo">
      <div class="titleBox">
        <div class="title">详细信息</div>
        <p class="descript">详细的职位介绍信息能帮助你更快找到合适的候选人</p>
      </div>
      <div class="inputBox">
        <div class="itemBox">
          <div class="itemTitle">工作经验</div>
          <div>
            <el-select v-model="experienceYear" placeholder="请选择" class="inputWidth">
              <el-option v-for="item in fixExperienceYea" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">最低学历</div>
          <div>
            <el-select v-model="academicRequirements" placeholder="请选择" class="inputWidth">
              <el-option
                v-for="item in fixAcademicRequirements"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">岗位职责</div>
          <div class="inputWidth2">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              v-model="jobDescription"
              placeholder="请输入岗位职责"
            ></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">任职要求</div>
          <div class="inputWidth2">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              v-model="requirements"
              placeholder="请输入任职要求"
            ></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">福利待遇</div>
          <div>
            <!-- <mul-select :mulData="fixWelfareOption" @changeMul="changeMul" :checkboxGroup="welfare"></mul-select> -->

            <!-- <mul-select :mulData="fixWelfareOption" v-model="welfare"></mul-select> -->
            <mul-select :mulData="fixWelfareOption" :welfare.sync="welfare"></mul-select>
          </div>
          <!-- <div>
            <el-select multiple v-model="welfare" placeholder="请选择（可多选）" class="inputWidth">
              <el-option
                v-for="item in fixWelfareOption"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>-->
        </div>

        <div class="itemBox">
          <div class="itemTitle">联系电话</div>
          <div class="priceBox">
            <div class="inputWidth">
              <el-input v-model="postPhone" placeholder="联系电话"></el-input>
            </div>
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
            <el-input v-model="postCity" placeholder="详细地点" @change="changeAddress"></el-input>
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
        <el-button type="primary" class="companyBg mar120" @click="handleCreate">发布职位</el-button>
      </div>
    </div>
    <el-dialog title="支付购买" :visible.sync="dialogTableVisiblePay" destroy-on-close>
      <pay-buy
        :paydata="paydata"
        :type="1"
        @closedShow="closedShow"
        :otherPosition="otherPosition"
        :fucktype="1"
      ></pay-buy>
    </el-dialog>
  </div>
</template>

<script>
import payBuy from '@/components/payBuy/index'
import mulSelect from '@/components/mulSelect/index'
import cityData from '@/utils/city'
import fixData from '@/mixins/getfixData'
import Code from "@/api/statusCode";
import { SaveJobOffers, JobAddOrEditInit } from '@/api/postJob'
import { ServicePayInit } from '@/api/timeJob'
import { GetPostNum, CommonConvertBoutiqueJob } from '@/api/positionManagement'
export default {
  name: "PostJob",
  data() {
    return {
      positionId: 0,
      action: "add",//edit=编辑；add=新增
      postType: "",//职位类型
      jobType: "全职",//招聘类型（全职，兼职，实习
      postName: "",//岗位名称
      hiring: "",//招聘人数
      payroll: "",//薪资(如："8-10K")
      welfare: [],//福利待遇
      experienceYear: "",//工作经验（如："1-3年经验"
      postEmail: "",//公司招聘邮箱
      postPhone: "",//公司招聘电话
      jobDescription: "",//职位描述
      requirements: "",//任职要求
      academicRequirements: "",//学历要求
      postCity: "",//就职城市
      postCitys: [],//省市区

      serviceCode: '普通职位',//服务编号:1001=普通职位,1002=精品职位


      minPrice: "",
      maxPrice: "",
      checkPrice: "元/月",
      priceOptions: [
        '元/小时',
        '元/日',
        '元/月',
        '元/年',
        '面议'
      ],
      postTypeOption: ['普通职位', '精品职位'],
      jobTypeOption: ['全职', '兼职', '实习'],
      cityData: cityData,

      center: { lng: 114.132542, lat: 22.579092 },//经纬度
      zoom: 18, //地图展示级别
      dialogTableVisiblePay: false,
      paydata: {},
      BMap: null,
      jpNum: 0   //精品剩余个数

    }
  },
  mixins: [fixData],
  beforeRouteEnter(to, from, next) {
    next(vm => {
      //职位编辑
      console.log(to.query.id)
      vm.positionId = to.query.id
      vm._JobAddOrEditInit()
    })
  },
  mounted() { },
  computed: {
    otherPosition() {
      return {
        positionId: this.positionId,
        serviceCode: this.serviceCode == '精品职位' ? 1002 : 1001,
        postStatus: 1//(1开启，2关闭)
      }
    },   //纯粹为了调接口
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
      return `${postCitys} ${this.postCity}`  //'深圳市罗湖区水贝金座大厦'
    }
  },
  components: { payBuy, mulSelect },
  methods: {
    changeMul(e) {      //获取了福利待遇
      this.welfare = e
    },
    handleShoweAction(e) {
      if (!e) {
        return
      }
      GetPostNum({}).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.jpNum = res.data.serviceSurplus1002
        }
      })
    },
    handleChangeAction() {//切换发布类型

      if (this.action == 'edit') {
        this.$confirm(`您的精品职位还剩${this.jpNum}次, 此操作会扣减1次额度,是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          CommonConvertBoutiqueJob({ jobId: this.positionId }).then(res => {
            if (res.status === Code.SUCCESS_CODE) {
              this.$message({
                type: 'success',
                message: '该职位已经成功更新为精品职位'
              });
            } else {
              this.$message({
                type: 'warning',
                message: res.message
              });
              this.serviceCode = '普通职位'  //改回来
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消更改'
          });
          this.serviceCode = '普通职位'  //改回来
        });
      }
    },
    _ServicePayInit() {     //职位初始化数据

      let data = {
        businesstype: 'Service',
        serviceCode: this.serviceCode == '精品职位' ? 1002 : 1001,    //服务码(1001普通职位；1002精品职位)
        groupId: 0,
      }
      ServicePayInit(data).then(res => {

        if (res.status === Code.SUCCESS_CODE) {
          this.paydata = res.data[0]
          this.dialogTableVisiblePay = true
        }
      })
    },
    closedShow() {
      this.dialogTableVisiblePay = false
    },
    handler({ BMap, map }) {   //地图
      this.BMap = BMap;
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
    handleCreate() {     //发布职位

      if (this.action === 'add') {    //如果是新增，则提示
        this.$confirm('职位发布后，职位名称和职位类型将不能修改，并扣减一次发布额度，请确认后发布?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._SaveJobOffers()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发布'
          });
        });
      } else {
        this._SaveJobOffers()
      }

    },
    _SaveJobOffers() {      //保存职位
      let welfare = '';
      if (this.welfare.length > 0) {  //福利待遇
        welfare = this.welfare.join(',')
      }
      debugger
      let postCitys = '';
      if (this.postCitys.length > 0) {  //地址
        postCitys = this.postCitys.join('-')
      }

      let postType = '';
      if (this.postType.length > 0 && this.postType instanceof Array) {
        postType = this.postType[1]
      } else {
        postType = this.postType
      }
      this.payroll = `${this.minPrice}-${this.maxPrice}${this.checkPrice}`
      let data = {
        positionId: this.action == 'add' ? 0 : this.positionId,
        action: this.action,//edit=编辑；add=新增

        postType: postType,//岗位类型
        jobType: this.jobType,//职位类型（全职，兼职，实习
        postName: this.postName,//岗位名称
        hiring: this.hiring,//招聘人数
        payroll: this.payroll,//薪资(如："8-10K")
        welfare: welfare,//福利待遇
        experienceYear: this.experienceYear,//工作经验（如："1-3年经验"

        postEmail: this.postEmail,//公司招聘邮箱
        postPhone: this.postPhone,//公司招聘电话
        jobDescription: this.jobDescription,//职位描述
        requirements: this.requirements,//任职要求
        academicRequirements: this.academicRequirements,//学历要求
        postCity: `${postCitys} ${this.postCity}`,//就职城市
        longitude: this.center.lng,//经度
        latitude: this.center.lat,//纬度
        serviceCode: this.serviceCode == '普通职位' ? 1001 : 1002,//服务编号:1001=普通职位,1002=精品职位
      }
      if (!this.action || !postType || !this.postName || !this.jobType || !this.hiring || !welfare || !this.payroll || !this.minPrice || !this.maxPrice || !this.checkPrice || !this.experienceYear || !this.requirements || !this.postPhone || !postCitys || !this.postCity || !this.jobDescription || !this.academicRequirements) {
        this.$message({
          message: '请检查输入信息是否完整~',
          type: 'warning'
        });
        return
      }
      SaveJobOffers(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            message: '发布成功',
            type: 'success'
          });
          this.$router.back()
        } else if (res.status === 1007) {     //职位已经用完了
          console.log(res)
          this.positionId = res.data?.positionId
          this.$confirm('您的服务余量已经用完，请续费或支付成功后使用此服务哦', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this._ServicePayInit();

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发布'
            });
          });
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },

    _JobAddOrEditInit() {       //职位编辑详情
      let data = {
        action: 'edit',
        positionId: this.positionId
      }
      JobAddOrEditInit(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          let { serviceCode, welfare, postType, postName, hiring, experienceYear, jobType,
            postEmail, postPhone, jobDescription, requirements, academicRequirements,
            minPayroll, maxPayroll, payrollUnit, provinceName, cityName, areaName, detailAddress, latitude, longitude } = res.data

          if (welfare) {
            this.welfare = welfare.split(',')
          }
          this.serviceCode = serviceCode == '1001' ? '普通职位' : '精品职位'
          this.action = 'edit';

          this.postType = postType;
          this.jobType = jobType;
          this.postName = postName;
          this.hiring = hiring;
          this.experienceYear = experienceYear;
          this.postEmail = postEmail;
          this.postPhone = postPhone;
          this.jobDescription = jobDescription;
          this.requirements = requirements;
          this.academicRequirements = academicRequirements
          this.minPrice = minPayroll;
          this.maxPrice = maxPayroll;
          this.checkPrice = payrollUnit;
          this.postCitys = areaName ? [provinceName, cityName, areaName] : [provinceName, cityName];
          this.postCity = detailAddress,
            this.center = {
              lng: longitude,
              lat: latitude
            }
        }
      })
    },

  }
}
</script>

<style lang="less">
.contextWrap {
  width: 1200px;
  margin: 0 auto;
  background-color: #fff;
}
.postWrap {
  background-color: #fff !important;
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
  p {
    margin-left: 10px;
    color: #999;
    font-size: 12px;
  }
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
.inputWidth1 {
  width: 170px;
  margin-right: 20px;
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
</style>