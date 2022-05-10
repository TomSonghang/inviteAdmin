<template>
  <div class="contextWrap">
    <div>
      <div class="titleBox">
        <div class="title">基本信息</div>
        <p class="descript">职位名称和职位类型发布后不可修改，请准确填写</p>
      </div>
      <div class="inputBox">
        <div class="itemBox">
          <div class="itemTitle">发布类型</div>
          <div>
            <el-select v-model="postType" placeholder="请选择" class="inputWidth">
              <el-option v-for="item in postTypeOption" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
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
            <el-input v-model="postName" placeholder="请输入职位名称"></el-input>
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
            <el-cascader class="inputWidth" placeholder="职位分类，可搜索" :options="postArray" filterable></el-cascader>
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
        <div class="title">其他信息</div>
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
          <div class="itemTitle">最高学历</div>
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
            <el-select multiple v-model="welfare" placeholder="请选择" class="inputWidth">
              <el-option
                v-for="item in fixWelfareOption"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </div>
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
              popper-class="casClass"
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
            <el-input v-model="postCity" placeholder="详细地点" @blur="changeAddress"></el-input>
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
                  :labelStyle="{ color: 'red', fontSize: '24px' }"
                  :offset="{ width: -35, height: 30 }"
                />
              </bm-marker>
            </baidu-map>
          </template>
        </div>
        <el-button type="primary" class="companyBg mar120" @click="handleCreate">发布职位</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import cityData from '@/utils/city'
import fixData from '@/mixins/getfixData'
import Code from "@/api/statusCode";
import { SaveJobOffers, JobAddOrEditInit } from '@/api/postJob'
export default {
  name: "PostJob",
  data() {
    return {
      positionId: 0,
      action: "add",//edit=编辑；add=新增
      postType: "普通职位",//职位类型
      jobType: "全职",//职位类型（全职，兼职，实习
      postName: "",//岗位名称
      hiring: "",//招聘人数
      payroll: "",//薪资(如："8-10K")
      welfare: "",//福利待遇
      experienceYear: "",//工作经验（如："1-3年经验"
      postEmail: "",//公司招聘邮箱
      postPhone: "",//公司招聘电话
      jobDescription: "",//职位描述
      requirements: "",//任职要求
      academicRequirements: "",//学历要求
      postCity: "",//就职城市
      postCitys: [],//省市区
      longitude: "",//经度
      latitude: "",//纬度
      //serviceCode: "",//服务编号:1001=普通职位,1002=精品职位

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

      center: { lng: 117.063035, lat: 36.672767 },//经纬度
      zoom: 15, //地图展示级别
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
      return `${postCitys} ${this.postCity}`
    }
  },
  methods: {
    handler({ BMap, map }) {   //地图
      let that = this;
      console.log(BMap, map)
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

      /*
      let _this = this;	// 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function (r) {
        //console.log(r);
        _this.center = { lng: r.longitude, lat: r.latitude };		// 设置center属性值
        _this.autoLocationPoint = { lng: r.longitude, lat: r.latitude };		// 自定义覆盖物
        _this.initLocation = true;
      }, { enableHighAccuracy: true })

      window.map = map
*/

    },
    dragend(event) {
      debugger
    },
    changeAddress() {
      this.handler()
    },
    handleCreate() {     //发布职位
      this._SaveJobOffers()
    },
    _SaveJobOffers() {      //保存职位
      let welfare = '';
      if (this.welfare.length > 0) {  //福利待遇
        welfare = this.welfare.join(',')
      }
      let postCitys = '';
      if (this.postCitys.length > 0) {  //地址
        postCitys = this.postCitys.join('-')
      }
      this.payroll = `${this.minPrice}-${this.maxPrice}${this.checkPrice}`
      let data = {
        positionId: this.positionId,
        action: this.action,//edit=编辑；add=新增
        postType: this.postType,//岗位类型
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
        longitude: this.longitude,//经度
        latitude: this.latitude,//纬度
        serviceCode: this.serviceCode == '普通职位' ? 1001 : 1002,//服务编号:1001=普通职位,1002=精品职位
      }
      SaveJobOffers(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            showClose: true,
            message: '发布成功',
            type: 'success'
          });
          this.$router.back()
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
          let { welfare, postType, postName, hiring, experienceYear, jobType,
            postEmail, postPhone, jobDescription, requirements, academicRequirements,
            minPayroll, maxPayroll, payrollUnit, provinceName, cityName, areaName, detailAddress } = res.data
          if (welfare) {
            this.welfare = welfare.split(',')
          }
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
          this.postCitys = areaName ? [provinceName, cityName] : [provinceName, cityName, areaName];
          this.postCity = detailAddress
        }
      })
    },
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
.bm-view {
  width: 500px;
  height: 500px;
}
</style>