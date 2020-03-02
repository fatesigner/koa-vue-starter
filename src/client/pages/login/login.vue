<template>
  <div class="login">
    <h2>Koa-vue-starter4</h2>
    <div class="center">
      <div class="input">
        <label>
          <input v-model="form.username.value" placeholder="输入用户名"/>
        </label>
        <transition-slide>
          <div class="error-message" v-if="form.username.error.visible">{{form.username.error.message}}</div>
        </transition-slide>
      </div>
      <div class="input">
        <label>
          <input type="password" v-model="form.password.value" placeholder="输入密码"/>
        </label>
        <transition-slide>
          <div class="error-message" v-if="form.password.error.visible">{{form.password.error.message}}</div>
        </transition-slide>
      </div>
      <button type="submit" @click="onSubmit" :disabled="uploading">登录</button>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialog.visible"
      center>
      <div class="vui-tc">
        <div class="vui-f12 vui-mb10">{{dialog.message}}</div>
        <el-button type="primary" @click="dialog.visible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Button, Dialog, Message } from 'element-ui';

  import * as AppStore from '../../store';
  import { ApiService } from '../../api';
  import { TransitionSlide } from '../../components/transition';
  import * as ProgressBarStore from '../../components/progress-bar/store';

  Vue.use(Button);
  Vue.use(Dialog);

  @Component({
    name: 'LoginPage',
    components: {
      TransitionSlide
    }
  })
  export default class LoginPage extends Vue {

    uploading = false;

    form = {
      username: {
        value: '漆黑之翼',
        getValue() {
          return this.value.trim();
        },
        verify() {
          const value = this.getValue();
          if (!value) {
            this.error.message = '请输入用户名';
            this.error.visible = true;
            setTimeout(() => {
              this.error.visible = false;
            }, 2000);
            return false;
          }
          return true;
        },
        error: {
          message: '',
          visible: false
        }
      },
      password: {
        value: 'admin1234',
        getValue() {
          return this.value;
        },
        verify() {
          const value = this.getValue();
          if (!value) {
            this.error.message = '请输入密码';
            this.error.visible = true;
            setTimeout(() => {
              this.error.visible = false;
            }, 2000);
            return false;
          }
          return true;
        },
        error: {
          message: '',
          visible: false
        }
      }
    };

    dialog = {
      visible: false,
      message: ''
    };

    // 验证表单
    verify() {
      return new Promise((resolve, reject) => {
        let valid = true;
        const formData = {};
        Object.keys(this.form).forEach((key) => {
          valid = this.form[key].verify();
          formData[key] = this.form[key].getValue();
        });

        if (valid) {
          resolve(formData);
        } else {
          reject(new Error());
        }
      });
    }

    // 提交表单
    onSubmit() {
      this.verify().then((formData: any) => {
        this.uploading = true;
        this.$store.dispatch(ProgressBarStore.ActionKeys.present);
        ApiService.login(formData).then((res) => {
          this.$store.dispatch(AppStore.ActionKeys.login, res.data);
          Message.success({
            message: '登录成功',
            duration: 800
          });
          // 跳转至 redirect 或者 首页
          const path: any = this.$route.query.redirect || '/';
          this.$router.push({ path: path });
        }).catch((err) => {
          this.dialog.visible = true;
          this.dialog.message = err.message;
        }).finally(() => {
          this.uploading = false;
          this.$store.dispatch(ProgressBarStore.ActionKeys.dismiss);
        });
      }).catch(() => {
      });
    }
  }
</script>

<style lang="scss">
  @import '../../theme/default.theme';

  :global {
    .login {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      h2 {
        margin-bottom: 50px;
        font-size: 32px;
        font-style: italic;
        font-weight: bold;
        color: map-get($colors, primary);
        text-align: center;
      }

      .center {
        margin: 0 auto;

        .input {
          position: relative;
          margin-bottom: 35px;
          border-color: rgb(223, 225, 230);
          border-style: solid;
          border-width: 2px;
          border-radius: 3px;

          input {
            width: 100%;
            height: 39px;
            padding: 6px;
            border: none;
          }
        }

        button {
          width: 100%;
          height: 39px;
          line-height: 39px;
          color: #fff;
          text-decoration: none;
          cursor: pointer;
          background: map-get($colors, primary);
          border-width: 0;
          border-radius: 3px;
          transition: background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;

          &[disabled] {
            color: #fff;
            background-color: #999;
          }
        }
      }

      .error-message {
        position: absolute;
        right: 0;
        left: 0;
        padding: 5px;
        font-size: 12px;
        color: red;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    @media (min-width: 704px) {
      .login .center {
        width: 400px;
        padding: 60px 40px 60px;
        margin: 0 auto 24px;
        background-color: #fff;
        border-radius: 3px;
        box-shadow: rgba(0, 0, 0, 0.1) 0 0 10px;
      }
    }

    @media (max-width: 704px) {
      .login .center {
        width: 320px;
        padding: 0 8px;
      }
    }
  }
</style>
