<template >
  <div class="contextWrap">
    <div class="hotCity">
      <div class="title">热门城市</div>
      <div class="hotItem" @click="handleCheckHot">
        <span :key="0" data-name>全国</span>
        <span
          v-for="item in cityData.hotDatas"
          :key="item.id"
          :dataname="item.cityName"
        >{{ item.cityName }}</span>
      </div>
    </div>

    <div class="checkgolba">
      <p class="twoTitle">按首页字母查找</p>
      <el-tabs :tab-position="tabPosition" style="height: 200px;" type="border-card">
        <el-tab-pane :label="val" v-for="(key, val, index) in cityData.datas">
          <ul class="cityBox" @click="handleCheckHot">
            <li v-for="item in key" class="cityItem">{{ item.name }}</li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Code from "@/api/statusCode";
import { CityList } from '@/api/search'
export default {
  data() {
    return {
      cityData: {},
      tabPosition: 'top',
    };
  },
  mounted() {
    if (localStorage.getItem('cityData')) {
      let cityData = localStorage.getItem('cityData')
      cityData = JSON.parse(cityData)
      this.cityData = cityData
    } else {
      this._CityList();
    }
  },
  methods: {
    handleCheckHot(e) {    //选择热门城市
      console.log(e.target)
      this.$router.replace({
        name: "Search",
        query: {
          name: e.target.innerText
        }
      })

    },
    objectOrder(obj) {//排序的函数
      let newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
      let newObj = {};//创建一个新的对象，用于存放排好序的键值对
      for (let i = 0; i < newkey.length; i++) {//遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
      }
      return newObj;//返回排好序的新对象
    },

    _CityList() {
      CityList({ cityName: '' }).then(res => {
        if (res.status === Code.SUCCESS_CODE) {
          let newData = res.data.datas.reduce((a, b) => {

            if (!a[b.shortPinyin]) {
              a[b.shortPinyin] = [];
            }
            a[b.shortPinyin].push({
              id: b.id,
              name: b.name
            })
            return a

          }, {})
          res.data.datas = this.objectOrder(newData)    //ABC按字母排序
          localStorage.setItem('cityData', JSON.stringify(res.data))
          this.cityData = res.data
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.contextWrap {
  width: 1200px;
  margin: 20px auto 0;
  background-color: #fff !important;
}
.hotCity {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}
.title {
  margin-right: 20px;
  font-size: 16px;
  color: #333;
}
.hotItem {
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    padding: 8px 15px;
    background-color: #fff;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    &:hover {
      background-color: #13b5b1;
      color: #fff;
      border-radius: 3px;
    }
  }
}
.twoTitle {
  margin-bottom: 20px;
}
.cityBox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .cityItem {
    display: inline-block;
    padding: 8px 15px;
    background-color: #fff;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    &:hover {
      background-color: #13b5b1;
      color: #fff;
      border-radius: 3px;
    }
  }
}
</style>