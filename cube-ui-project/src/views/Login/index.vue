<template>
  <div class="wrapper">
    <MHeader>登录</MHeader> 
    <!-- <img src="@/assets/images/background.jpg" alt=""> -->
    <cube-form :model="model" @submit="submitHandler">
      <cube-form-group>
        <cube-form-item :field="fields[0]"></cube-form-item>
        <cube-form-item :field="fields[1]"></cube-form-item>
      </cube-form-group>
      <cube-form-group>
        <cube-button type="submit">Submit</cube-button>
      </cube-form-group>
    </cube-form>
  </div>
</template>
<script>
import * as types from "@/store/actions-type";
import { mapActions } from "vuex";
import MHeader from "@/components/MHeader";
export default {
  components: {
    MHeader
  },
  data() {
    return {
      model: {
        username: "",
        password: ""
      },
      fields: [
        {
          type: "input",
          modelKey: "username",
          label: "用户名",
          props: {
            placeholder: "请输入用户名"
          },
          rules: {
            required: true //规定必须填
          }
        },
        {
          type: "input",
          modelKey: "password",
          label: "密码",
          props: {
            placeholder: "请输入密码",
            type: "password"
          },
          rules: {
            required: true //规定必须填
          }
        }
      ]
    };
  },
  methods: {
    ...mapActions([types.LOGIN]),
    submitHandler(e) {
      //发请求
      e.preventDefault();
      try {
        // 登录
        this[types.LOGIN](this.model);
        this.$router.push("/");
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
};
</script>
