<template>
  <div>
    <el-dropdown class="userDd">
      <div class="userDrop">
        <span class="userDrop_text">
          {{ userName }}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <img :src="headPath" alt="头像" />
      </div>
      <el-dropdown-menu solt="dropdown">
        <el-dropdown-item>
          <router-link to="/"><i class="el-icon-s-home"></i>首页</router-link>
        </el-dropdown-item>
        <!-- <el-dropdown-item>
          <router-link to="/personal"
            ><i class="el-icon-s-custom"></i>我的主页</router-link
          >
        </el-dropdown-item> -->
        <el-dropdown-item divided>
          <a @click="_loginOut()"><i class="el-icon-switch-button"></i>登出</a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userName","headPath"])
  },
  methods: {
    _loginOut() {
      this.$store.dispatch("user/loginOut");
    }
  }
};
</script>
