<template>
  <div class="contextWrap">
    <div class="left">
      <ul class="ulBox">
        <li
          class="liItem"
          :datatab="item.tab"
          v-for="(item, index) in tabData"
          :class="index == active ? 'active' : ''"
          @click="handleItem"
        >
          <span :datatab="item.tab">{{ item.name }}</span>
          <i class="el-icon-arrow-right"></i>
        </li>
      </ul>
    </div>
    <div class="right">
      <div class="part1" v-show="active === 0">
        <div class="titleBox">
          <div class="title">公司基本信息</div>
          <p class="descript">丰富的公司介绍，能获得更多求职者的青睐，为你的职位带来更多查看</p>
        </div>

        <div class="itemBox">
          <div class="itemTitle">企业头像</div>
          <div>
            <el-upload
              class="avatar-uploader"
              :action="uploadActionUrl"
              accept="image/jpeg, image/gif, image/png"
              :headers="{
                Authorization: token
              }"
              :show-file-list="false"
              :on-success="handleAvatarSuccessHeard"
              :before-upload="beforeAvatarUploadHeard"
            >
              <img v-if="path" :src="path" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
        <div class="itemBox">
          <div class="itemTitle">企业名称</div>
          <div>
            <el-input v-model="companyName" :disabled="businessLicenseStatus=='2' || businessLicenseStatus=='1' " placeholder="请输入内容" class="inputWidth3"></el-input>
            <span class="textTitle">认证通过后企业名称不支持自行更改，如需调整请联系点金台客服</span>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">企业性质</div>
          <div>
            <el-select v-model="companyType" placeholder="请选择" class="inputWidth3">
              <el-option v-for="item in companyTypeOptions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">企业规模</div>
          <div>
            <el-select v-model="companySize" placeholder="请选择" class="inputWidth3">
              <el-option v-for="item in companySizeOption" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">联系电话</div>
          <div>
            <el-input v-model="tel" placeholder="请输入内容" class="inputWidth3"></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">企业传真</div>
          <div>
            <el-input v-model="fax" placeholder="请输入内容" class="inputWidth3"></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">企业网站</div>
          <div>
            <el-input v-model="website" placeholder="请输入内容" class="inputWidth3"></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">企业邮箱</div>
          <div>
            <el-input v-model="email" placeholder="请输入内容" class="inputWidth3"></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">省市区</div>
          <div>
            <el-cascader
              v-model="postCitys"
              class="inputWidth3"
              placeholder="省市区，可搜索"
              :options="cityData"
              filterable
              :props="{ value: 'label' }"
            ></el-cascader>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">详细地点</div>
          <div class="inputWidth3">
            <el-input v-model="postCity" placeholder="详细地点"></el-input>
          </div>
        </div>
        <el-button type="primary" class="companyBg mar120" @click="handleBase">确定</el-button>
      </div>
      <!--基本信息-->
      <div class="part2" v-show="active === 1">
        <div class="titleBox">
          <div class="title">公司介绍</div>
          <p class="descript">可以简单介绍一下公司的发展状况，服务领域，主营产品等</p>
        </div>

        <div class="itemBox">
          <div class="inputWidth2">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6, maxRows: 10 }"
              v-model="jobDescription"
              placeholder="请输入岗位职责"
            ></el-input>
          </div>
        </div>
        <el-button type="primary" @click="handleDes" class="companyBg">保存</el-button>
      </div>
      <!--公司介绍-->
      <div class="part3" v-show="active === 2">
        <div class="titleBox">
          <div class="title">业务信息</div>
          <p class="descript">详细的业务信息会给面试者更多了解公司的机会</p>
        </div>
        <div class="itemBox">
          <div class="itemTitle">是否公开</div>
          <div>
            <el-switch v-model="isOpenBusines" active-color="#13b5b1" inactive-color="#999"></el-switch>
          </div>
        </div>
        <div class="itemBox">
          <div class="itemTitle">业务人名</div>
          <div>
            <el-input v-model="businesContact" placeholder="请输入内容" class="inputWidth"></el-input>
          </div>
        </div>
        <div class="itemBox">
          <div class="itemTitle">业务电话</div>
          <div>
            <el-input v-model="businesTel" placeholder="请输入内容" class="inputWidth"></el-input>
          </div>
        </div>
        <div class="itemBox">
          <div class="itemTitle">业务传真</div>
          <div>
            <el-input v-model="businesFax" placeholder="请输入内容" class="inputWidth"></el-input>
          </div>
        </div>
        <div class="itemBox">
          <div class="itemTitle">业务邮箱</div>
          <div>
            <el-input v-model="businesEmail" placeholder="请输入内容" class="inputWidth"></el-input>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">企业标签</div>
          <div>
            <el-cascader
              class="inputWidth"
              :props="{ emitPath: false, multiple: true, label: 'tagName', value: 'tagName', children: 'subset' }"
              :options="businesInfoTag"
              v-model="companyTag"
              separator="、"
              :show-all-levels="false"
            ></el-cascader>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">经营模式</div>
          <div>
            <el-select v-model="businessModel" multiple placeholder="请选择" class="inputWidth">
              <el-option
                v-for="item in classifyInfo"
                :key="item.id"
                multiple
                :label="item.className"
                :value="item.className"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">主营产品</div>
          <div>
            <el-select v-model="mainProduct" placeholder="请选择" multiple class="inputWidth">
              <el-option-group v-for="group in mainOptions" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.options"
                  :key="item.id"
                  :label="item.className"
                  :value="item.className"
                ></el-option>
              </el-option-group>
            </el-select>
          </div>
        </div>

        <div class="itemBox">
          <div class="itemTitle">产品图片</div>
          <div class="itemMain">
            <el-upload
              action="#"
              ref="uploadProduct"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              multiple
              :limit="9"
              name="product"
              :http-request="handleProductUp"
              :file-list="productPicture"
              :auto-upload="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </div>
        </div>

        <el-button type="primary" class="companyBg mar120" @click="handleBusines">确定</el-button>
      </div>
      <!--业务信息-->
      <div class="part4" v-show="active === 3">
        <div class="titleBox">
          <div class="title">公司资质</div>
          <p class="descript">三证合一只需上传营业执照；如未登记和审核失败会显示上传按钮，审核中和审核成功仅展示审核状态;</p>
        </div>

        <div class="itemBox">
          <div class="itemTitle">营业执照</div>
          <div v-if="businessLicenseStatus === '0' || businessLicenseStatus === '3'">
            <el-upload
              class="avatar-uploader"
              :action="uploadBusinessUrl"
              accept="image/jpeg, image/gif, image/png"
              :headers="{
                Authorization: token
              }"
              style=" border: 1px dashed #d9d9d9;border-radius: 6px;"
              :show-file-list="false"
              :on-success="handleAvatarSuccessBusiness"
              :on-error="handleErrorBusiness"
              :data="{ fileFlag: 2 }"
            >
              <img v-if="pathBusiness" :src="pathBusiness" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="textStyle" v-else>
            <span>{{ businessLicenseStatus | statu }}</span>
          </div>
        </div>
      </div>
      <!--团队风采-->
      <div class="part5" v-show="active === 4">
        <div class="titleBox">
          <div class="title">团队风采</div>
          <p class="descript">支持jpg,jpeg,gif,png图片文件，图片尺寸：130px*130px</p>
        </div>
        <div class="itemBox">
          <div>
            <el-upload
              action="#"
              ref="uploadTeam"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview1"
              :on-remove="handleRemoveTeam"
              multiple
              :limit="9"
              name="team"
              :http-request="handleTeamUp"
              :file-list="TeamPicture"
              :auto-upload="false"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible1">
              <img width="100%" :src="dialogImageUrl1" alt />
            </el-dialog>
          </div>
        </div>
        <el-button type="primary" class="companyBg" @click="handleTeam">确定</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import store from "@/store";
import cityData from '@/utils/city'
import Code from "@/api/statusCode";
import {
  CompanyInformation,
  GetCompanyBusinesInfoTag,
  UpdateCompanyIntroduction,
  UpdateCompanyInformation,
  UpdateTeamStyle,
  UpdateCompanyBusinesInfo,
  GetDjtCompanyClassifyInfo
} from '@/api/company'
export default {
  data() {
    return {
      uploadActionUrl: `${process.env.VUE_APP_BASE_API}/api/Enterprise/UpdateHeadPortrait`,   //上传头像地址
      uploadBusinessUrl: `${process.env.VUE_APP_BASE_API}/api/Enterprise/UpLoadBusinessLicense`,   //上传资质图片
      path: "", //头像
      pathBusiness: "",      //资质
      companyName: "",
      companyType: "",
      companySize: "",
      tel: "",
      fax: "",
      email: "",
      website: "",
      jobDescription: "",//公司介绍
      companyTag: "",//企业标签
      businessModel: "",//经营模式
      mainProduct: "",   //主营产品
      businesContact: "",    //联系人
      businesTel: "",//联系电话
      businesEmail: "",//业务邮箱
      businesFax: "",    //业务传真
      cityData: cityData,
      companySizeOption: ['不限', '1-20人', '21-50人', '51-100人', '101-500人', '501-1000人', '1000人以上'],
      companyTypeOptions: ['不限', '国有企业', '民营企业', '三资企业', '集体企业'],
      tabData: [
        { name: '公司基本信息', tab: 0 },
        { name: '公司介绍', tab: 1 },
        { name: '业务信息', tab: 2 },
        { name: '公司资质', tab: 3 },
        { name: '团队风采', tab: 4 },
      ],
      active: 0,
      token: "",  //上传图片需要token

      isOpenBusines: false,    //业务是否公开
      classifyInfo: [], //公司经营模式
      businesInfoTag: [],      //企业标签

      postCitys: [], //省市区
      postCity: "",//详细地址
      //mainOptions: [], //主营产品

      dialogVisible: false,     //产品查看图片
      dialogImageUrl: "",      //查看产品图片地址
      formDate: new FormData(),  //产品图片流数据
      productPicture: [],     //产品图片数据
      delImgUrl: [],  //产品图片删除的图片




      dialogVisible1: false,     //团队风采查看图片
      dialogImageUrl1: "",      //团队图片地址
      formDateTeam: new FormData(),  //团队图片流数据
      TeamPicture: [],     //团队图片数据
      delImgUrlTeam: [],   //团队图片删除的图片


      businessLicenseStatus: "0"     //营业执照状态
    }
  },
  mounted() {
    this._CompanyInformation()
    const token = store.getters.token;
    this.token = `Bearer ${token}`;
    this._GetDjtCompanyClassifyInfo();//获取经营模式这些数据
    this._GetCompanyBusinesInfoTag();//企业标签

  },
  filters: {
    statu(statu) {
      switch (statu) {
        case '0':
          return '未登记'
          break;
        case '1':
          return '审核中'
          break;
        case '2':
          return '已通过'
          break;
        case '3':
          return '未通过'
          break;

      }
    }
  },
  computed: {
    mainOptions: function () { //主营选项
      let that = this
      let arr = this.classifyInfo.reduce((a, b) => {
        if (that.businessModel.includes(b.className)) {
          a.push({ label: b.className, options: b.subset })
        }
        return a
      }, [])
      return arr
    }
  },
  methods: {
    handleRemove(file) {      //产品删除
      let url = file.url;
      let index = url.lastIndexOf('/');
      url = url.slice(index + 1);
      this.delImgUrl.push(url);
    },
    handleRemoveTeam(file) {      //产品删除
      let url = file.url;
      let index = url.lastIndexOf('/');
      url = url.slice(index + 1);
      this.delImgUrlTeam.push(url);
    },
    handleProductUp(file) {    //上传产品图片
      this.formDate.append('file', file.file);
    },
    handleTeamUp(file) {    //上传团队图片
      this.formDateTeam.append('file', file.file);
    },
    _UpdateTeamStyle() {    //团队风采
      this.formDateTeam = new FormData()
      this.$refs.uploadTeam.submit();
      let delImgUrlTeam = ''
      if (this.delImgUrlTeam.length > 0) {
        delImgUrlTeam = this.delImgUrlTeam.join(',')
      }
      let data = {
        delImgUrl: delImgUrlTeam
      }
      Object.keys(data).forEach(key => {
        this.formDateTeam.append(key, data[key]);
      })

      let config = 'multipart/form-data'
      UpdateTeamStyle(this.formDateTeam, config).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          // this.$refs.uploadTeam.clearFiles();
          this.$message({
            showClose: true,
            message: '更新成功~',
            type: 'success'
          });
        }
      })
    },
    handleBase() {     //保存公司基本信息
      this._UpdateCompanyIntroduction()
    },
    _UpdateCompanyIntroduction() {
      let address = '';
      if (this.postCitys.length > 0) {
        address = this.postCitys.join('-')
        address = `${address} ${this.postCity}`
      }
      let data = {
        companyName: this.companyName,
        companyType: this.companyType,
        companySize: this.companySize,
        tel: this.tel,
        fax: this.fax,
        website: this.website,
        email: this.email,
        address: address || '',
        longitude: "",
        latitude: "",
        businessCircle: ""   //商业圈
      }
      if (!this.companyName || !this.companyType || !this.tel || !address) {
        this.$message({
          message: '请检查企业名称、企业性质、联系电话、地址信息是否完整~',
          type: 'warning'
        });
        return
      }
      UpdateCompanyIntroduction(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            showClose: true,
            message: '更新成功~',
            type: 'success'
          });
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    handleBusines() {   //保存业务信息
      this._UpdateCompanyBusinesInfo()
    },
    _UpdateCompanyBusinesInfo() {    //保存业务信息
      this.formDate = new FormData()
      this.$refs.uploadProduct.submit();

      /*上传图片*/
      let companyTag, businessModel, mainProduct, delImgUrl;
      let model = [];
      let product = [];
      if (this.companyTag.length > 0) {
        companyTag = this.companyTag.join('、')
      }
      if (this.businessModel.length > 0) {
        businessModel = this.businessModel.join('、')
      }
      if (this.mainProduct.length > 0) {
        mainProduct = this.mainProduct.join('、')
      }
      this.classifyInfo.forEach(item => {
        if (this.businessModel.includes(item.className)) {
          model.push(`[${item.id}]`)
        }
      })
      this.mainOptions.forEach(item => {
        item.options.forEach(todo => {
          if (this.mainProduct.includes(todo.className)) {
            product.push(`(${todo.id})`)
          }
        })
      })
      let str = [...model, ...product].join(',');

      if (this.delImgUrl.length > 0) {
        delImgUrl = this.delImgUrl.join(',')
      }
      let data = {
        delImgUrl: delImgUrl || '',
        businesContact: this.businesContact,
        businesTel: this.businesTel,
        businesEmail: this.businesEmail,
        businesFax: this.businesFax,
        companyTag: companyTag || '',
        businessModel: businessModel || '',
        mainProduct: mainProduct || '',
        mainProductId: str || '',
        isOpenBusines: this.isOpenBusines,
      }
      if (!this.businesTel || !businessModel || !mainProduct) {
        this.$message({
          message: '请检查业务电话、经营模式、主营产品、信息是否完整~',
          type: 'warning'
        });
        return
      }
      Object.keys(data).forEach(key => {
        this.formDate.append(key, data[key]);
      })
      let config = 'multipart/form-data'
      UpdateCompanyBusinesInfo(this.formDate, config).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          // this.$refs.uploadProduct.clearFiles();
          this.$message({
            showClose: true,
            message: '更新成功~',
            type: 'success'
          });
        }
      })
    },
    handlePictureCardPreview(file) {     //查看产品图片
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreview1(file) {     //查看团队风采
      this.dialogImageUrl1 = file.url;
      this.dialogVisible1 = true;
    },
    handleTeam() {     //保存团队风采
      this._UpdateTeamStyle()
    },
    _GetDjtCompanyClassifyInfo() {    //企业经营模式
      GetDjtCompanyClassifyInfo({}).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.classifyInfo = res.data
        }
      })
    },
    _GetCompanyBusinesInfoTag() {//企业标签
      GetCompanyBusinesInfoTag({}).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.businesInfoTag = res.data
        }
      })
    },
    beforeAvatarUploadHeard(e) {      //上传头像前
      console.log(e)

    },
    handleAvatarSuccessHeard(res) {     //上传头像
      if (res.status === Code.SUCCESS_CODE) {
        this.path = res.data.args.HeadPortraitPath;
        store.dispatch('user/set_headpath', res.data.args.HeadPortraitPath)
      }
    },
    handleAvatarSuccessBusiness(res) {
      if (res.status === Code.SUCCESS_CODE) {
        this.$message({
          message: '上传成功，等待工作人员审核',
          type: 'success'
        });
        this.businessLicenseStatus = '1'
      } else {
        this.$message({
          message: res.message,
          type: 'warning'
        });
      }
    },
    handleErrorBusiness(res) {
      this.$message({
        message: res.message,
        type: 'warning'
      });
    },
    handleDes() {   //保存基本信息
      this._UpdateCompanyInformation();
    },
    _UpdateCompanyInformation() {
      let data = { companyInformation: this.jobDescription }
      UpdateCompanyInformation(data).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          this.$message({
            showClose: true,
            message: '更新成功~',
            type: 'success'
          });
        }
      })
    },
    _CompanyInformation() {
      CompanyInformation({}).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          let {
            path,
            companyName,
            companyType,
            companySize,
            fax,
            tel,
            email,
            website,
            businesEmail,
            companyInformation,
            businesContact,
            businesTel,
            businesFax,
            isOpenBusines,
            address,
            businessModel,
            mainProduct,
            companyTag,
            productPicture,
            teamStyle,
            businessLicenseStatus
          } = res.data;
          if (address) { //地址信息
            let arr = address.split(' ')
            this.postCity = arr[1];
            this.postCitys = arr[0].split('-')
          }
          if (businessModel) {    //经营模式
            businessModel = businessModel.split('、')
          }
          if (mainProduct) {
            mainProduct = mainProduct.split('、')
          }
          if (companyTag) {
            companyTag = companyTag.split('、')
          }
          if (productPicture) {   //产品
            let arr = []
            let newArr = []
            arr = productPicture.split(',')
            arr.forEach((item, index) => {
              newArr.push({
                name: index,
                url: item
              })
            })
            productPicture = newArr
          }
          if (teamStyle) {   //团队
            let arr = []
            let newArr = []
            arr = teamStyle.split(',')
            arr.forEach((item, index) => {
              newArr.push({
                name: index,
                url: item
              })
            })
            teamStyle = newArr
          }
          if(companyInformation){
            //公司介绍需要换换行符
            companyInformation= companyInformation.replace(/\$@\$/g,'\r\n')
          }
          this.path = path;
          this.companyName = companyName;
          this.companyType = companyType;
          this.companySize = companySize;
          this.fax = fax;
          this.tel = tel;
          this.email = email;
          this.website = website;
          this.businesEmail = businesEmail;
          this.jobDescription = companyInformation;
          this.businesContact = businesContact;
          this.businesTel = businesTel;
          this.businesFax = businesFax;
          this.isOpenBusines = isOpenBusines
          this.businessModel = businessModel || ''
          this.mainProduct = mainProduct || ''
          this.companyTag = companyTag || ''
          this.productPicture = productPicture || []
          this.TeamPicture = teamStyle || []
          this.businessLicenseStatus = businessLicenseStatus
        }
      })
    },
    handleItem(e) {     //左侧tab

      this.active = Number(e.target.attributes['datatab']?.value)
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>
<style lang="less" scoped>
.contextWrap {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  width: 1200px;
}
.left {
  flex-basis: 280px;
  height: 100vh;
  background-color: #dfe4f1;
}
.ulBox {
  box-sizing: border-box;

  font-size: 16px;
  color: #333;
}
.liItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  height: 40px;
  cursor: pointer;
  &:hover {
    background: #d8dfea;
  }
}
.active {
  background: #d8dfea;
}
.right {
  flex: 1;
  background: #fff;
  box-sizing: border-box;
  padding: 30px 50px;
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
.itemMain {
  flex: 1;
}
.flexLeft {
  justify-content: flex-start;
}
.inputWidth {
  width: 250px;
}
.inputWidth2 {
  width: 500px;
}
.inputWidth3 {
  width: 320px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #13b5b1;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.certificateBox {
  width: 120px;
  height: 120px;
}
.textStyle {
  color: #000;
}
.mar120 {
  margin-left: 120px;
}
.textTitle{
    margin-left: 10px;
    color: #999;
    font-size: 12px;
}
</style>