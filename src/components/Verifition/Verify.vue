<!-- eslint-disable -->
<template>
  <div v-show="showBox" :class="mode == 'pop' ? 'mask' : ''">
    <!-- <div :class="mode=='pop'?'verifybox':''" :style="{'max-width':parseInt(imgSize.width)+30+'px'}">
      <div v-if="mode=='pop'" class="verifybox-top">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close" />
        </span>
      </div> -->
    <div class="verifybox-bottom" :style="{ padding: mode == 'pop' ? '15px' : '0' }">
      <!-- 验证码容器 -->
      <div class="verify-slider-container">
        <components
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :captcha-type="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :v-space="vSpace"
          :explain="explain"
          :img-size="imgSize"
          :block-size="blockSize"
          :bar-size="barSize"
          @validVerify="validVerify"
        />
        <div class="bottom-action">
          <div class="action-btn close-btn" @click="closeBox"></div>
          <div class="action-btn refresh-btn" @click="refresh"></div>
        </div>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>
<script type="text/babel">
/* eslint-disable */
/**
 * Verify 验证码组件
 * @description 分发验证码使用
 * */
import VerifySlide from './Verify/VerifySlide'
import VerifyPoints from './Verify/VerifyPoints'
import { reqCheck } from '@/api/captcha'

export default {
  name: 'Vue2Verify',
  components: {
    VerifySlide,
    VerifyPoints,
  },
  props: {
    // 双语化
    locale: {
      require: false,
      type: String,
      default() {
        // 默认语言不输入为浏览器语言
        if (navigator.language) {
          var language = navigator.language
        } else {
          var language = navigator.browserLanguage
        }
        return language
      },
    },
    captchaType: {
      type: String,
      required: true,
    },
    figure: {
      type: Number,
    },
    arith: {
      type: Number,
    },
    mode: {
      type: String,
      default: 'pop',
    },
    vSpace: {
      type: Number,
    },
    explain: {
      type: String,
    },
    imgSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '155px',
        }
      },
    },
    blockSize: {
      type: Object,
    },
    barSize: {
      type: Object,
    },
  },
  data() {
    return {
      // showBox:true,
      clickShow: false,
      // 内部类型
      verifyType: undefined,
      // 所用组件类型
      componentType: undefined,
    }
  },
  computed: {
    instance() {
      return this.$refs.instance || {}
    },
    showBox() {
      if (this.mode == 'pop') {
        return this.clickShow
      } else {
        return true
      }
    },
  },
  watch: {
    captchaType: {
      immediate: true,
      handler(captchaType) {
        switch (captchaType.toString()) {
          case 'blockPuzzle':
            this.verifyType = '2'
            this.componentType = 'VerifySlide'
            break
          case 'clickWord':
            this.verifyType = ''
            this.componentType = 'VerifyPoints'
            break
        }
      },
    },
  },
  methods: {
    /**
     * i18n
     * @description 兼容vue-i18n 调用$t来转换ok
     * @param {String} text-被转换的目标
     * @return {String} i18n的结果
     * */
    i18n(text) {
      if (this.$t) {
        return this.$t(text)
      } else {
        // 兼容不存在的语言
        let i18n = this.$options.i18n.messages[this.locale] || this.$options.i18n.messages['en-US']
        return i18n[text]
      }
    },
    /**
     * refresh
     * @description 刷新
     * */
    refresh() {
      if (this.instance.refresh) {
        this.instance.refresh()
      }
    },
    closeBox() {
      this.clickShow = false
    },
    show() {
      if (this.mode == 'pop') {
        this.clickShow = true
        this.refresh()
      }
    },
    validVerify(captchaId, captchaCheckConfig) {
      reqCheck({ id: captchaId }, captchaCheckConfig).then((res) => {
        if (res) {
          this.$emit('success', { captchaId })
        } else {
          this.refresh()
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.verifybox-bottom {
  padding: 15px;
  box-sizing: border-box;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.3);
  /* display: none; */
  transition: all 0.5s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.verify-slider-container {
  background-color: #fff;
  width: 278px;
  z-index: 999;
  padding: 9px;
  border-radius: 6px;
  box-shadow: 0 0 11px 0 #999999;
}

:deep(img) {
  width: 100%;
  height: 100%;
}

:deep(.content) {
  width: 100%;
  height: 159px;
  position: relative;
}

:deep(.bg-img) {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: translate(0, 0);
}

:deep(.slider-img) {
  position: absolute;
  height: 100%;
  transform: translate(0, 0);
}

:deep(.slider-move) {
  height: 66px;
  width: 100%;
  margin-top: 11px;
  position: relative;
  display: flex;
  align-items: center;
}

.action-btn {
  width: 30px;
  height: 30px;
  background-size: 100% 100%;
}

.refresh-btn {
  background-image: url('@/assets/captcha/refresh.png');
  &:hover {
    cursor: pointer;
  }
}

.close-btn {
  background-image: url('@/assets/captcha/close.png');
  &:hover {
    cursor: pointer;
  }
}

.bottom-action {
  display: flex;
  button + button {
    margin-left: 10px;
  }
}

.verify-tips {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 30px;
  line-height: 30px;
  color: #fff;
}
</style>
