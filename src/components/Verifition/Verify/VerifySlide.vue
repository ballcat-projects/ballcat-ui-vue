<template>
  <div>
    <div class="content">
      <div ref="bgImgRef" class="bg-img">
        <img alt="" :src="verifyImgInfo?.captcha?.backgroundImage">
      </div>
      <div class="slider-img">
        <img
          ref="sliderImgRef"
          :style="`transform:translateX(${moveX}px)`"
          :src="verifyImgInfo?.captcha?.sliderImage"
          alt=""
        >
      </div>
    </div>
    <div class="slider-move">
      <div class="slider-move-track">拖动滑块完成拼图</div>
      <div
        class="slider-move-btn"
        :style="`transform:translateX(${moveX}px)`"
        @mousedown="down"
        @touchstart="down"
      />
    </div>
  </div>
</template>

<script>
import { reqGet, reqCheck } from '@/api/captcha'

export default {
  name: 'VerifySlide',
  props: {},
  data() {
    return {
      bgImgRef: '',
      sliderImgRef: '',
      verifyImgInfo: '',
      moveX: 0,
      currentCaptchaConfig: {},
      hasGetImgInfo: false,
    }
  },
  mounted() {},
  methods: {
    getPicture(cb) {
      return reqGet().then((res) => {
        this.verifyImgInfo = res
        !this.hasGetImgInfo && this.$nextTick(cb)
      })
    },
    refresh() {
      this.getPicture(() => {
        if(this.hasGetImgInfo) return;
        const { bgImgRef, sliderImgRef } = this.$refs
        const bgImgEle = bgImgRef
        const sliderImgEle = sliderImgRef
        const bgImageWidth = bgImgEle.offsetWidth
        const bgImageHeight = bgImgEle.offsetHeight
        const sliderImageWidth = sliderImgEle.offsetWidth
        const sliderImageHeight = sliderImgEle.offsetHeight
        this.currentCaptchaConfig = {
          startTime: new Date(),
          trackArr: [],
          movePercent: 0,
          bgImageWidth,
          bgImageHeight,
          sliderImageWidth,
          sliderImageHeight,
          end: 206,
        }
        this.hasGetImgInfo =true
      })
      this.currentCaptchaConfig = {
        ...this.currentCaptchaConfig,
        trackArr: [],
        startTime: new Date(),
      }
      this.moveX = 0
    },
    down(event) {
      const targetTouches = event.targetTouches
      let startX = event?.pageX
      let startY = event.pageY
      if (startX === undefined) {
        startX = Math.round(targetTouches[0].pageX)
        startY = Math.round(targetTouches[0].pageY)
      }
      const { currentCaptchaConfig } = this
      currentCaptchaConfig.startX = startX
      currentCaptchaConfig.startY = startY

      const pageX = currentCaptchaConfig.startX
      const pageY = currentCaptchaConfig.startY
      const startTime = currentCaptchaConfig.startTime
      const trackArr = currentCaptchaConfig.trackArr
      trackArr.push({
        x: pageX - startX,
        y: pageY - startY,
        type: 'down',
        t: new Date().getTime() - startTime.getTime(),
      })
      // pc
      window.addEventListener('mousemove', this.move)
      window.addEventListener('mouseup', this.up)
      // 手机端
      window.addEventListener('touchmove', this.move, false)
      window.addEventListener('touchend', this.up, false)
    },
    move(event) {
      let touchMouseEvent = event
      if (event instanceof TouchEvent) {
        touchMouseEvent = event.touches[0]
      }
      const { currentCaptchaConfig } = this
      const pageX = Math.round(touchMouseEvent.pageX)
      const pageY = Math.round(touchMouseEvent.pageY)
      const startX = currentCaptchaConfig.startX
      const startY = currentCaptchaConfig.startY
      const startTime = currentCaptchaConfig.startTime
      const end = currentCaptchaConfig.end
      const bgImageWidth = currentCaptchaConfig.bgImageWidth
      const trackArr = currentCaptchaConfig.trackArr
      let moveX = pageX - startX
      const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: 'move',
        t: new Date().getTime() - startTime.getTime(),
      }
      trackArr.push(track)
      if (moveX < 0) {
        moveX = 0
      } else if (moveX > end) {
        moveX = end
      }
      currentCaptchaConfig.moveX = moveX
      currentCaptchaConfig.movePercent = moveX / bgImageWidth
      this.doMove(currentCaptchaConfig)
    },
    up(event) {
      let touchMouseEvent = event
      window.removeEventListener('mousemove', this.move)
      window.removeEventListener('mouseup', this.up)
      window.removeEventListener('touchmove', this.move)
      window.removeEventListener('touchend', this.up)
      if (event instanceof TouchEvent) {
        touchMouseEvent = event.changedTouches[0]
      }
      const { currentCaptchaConfig } = this
      currentCaptchaConfig.stopTime = new Date()
      const pageX = Math.round(touchMouseEvent.pageX)
      const pageY = Math.round(touchMouseEvent.pageY)
      const startX = currentCaptchaConfig.startX
      const startY = currentCaptchaConfig.startY
      const startTime = currentCaptchaConfig.startTime
      const trackArr = currentCaptchaConfig.trackArr

      const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: 'up',
        t: new Date().getTime() - startTime.getTime(),
      }
      trackArr.push(track)
      this.valid(currentCaptchaConfig)
    },
    valid(config) {
      const {
        bgImageWidth,
        bgImageHeight,
        sliderImageWidth,
        sliderImageHeight,
        startTime: startSlidingTime,
        stopTime: endSlidingTime,
        trackArr: trackList,
      } = config
      const captchaCheckConfig = {
        bgImageWidth,
        bgImageHeight,
        sliderImageWidth,
        sliderImageHeight,
        startSlidingTime,
        endSlidingTime,
        trackList,
      }
      const { id } = this.verifyImgInfo
      // reqCheck({ id }, captchaCheckConfig).then((res) => {
      //   if (res) {
      //     this.$emit("success",{id}, captchaCheckConfig)
      //   } else {
      //     this.refresh()
      //   }
      // })
      this.$emit('validVerify',id, captchaCheckConfig)
    },
    doMove(config) {
      this.moveX = config.moveX
    },
  },
}
</script>

<style>
.slider-move-track {
  flex: 1;
  background-color: #dfe1e2;
  border-radius: 22px;
  font-size: 14px;
  padding: 10px 0;
  text-align: center;
  white-space: nowrap;
  color: #88949d;
  user-select: none;
}
.slider-img {
  position: absolute;
  height: 100%;
  transform: translate(0, 0);
}
.slider-move-btn {
  background: url('@/assets/captcha/captcha-slider.png');
  background-position-x: -4px;
  background-size: 100% 100%;
  transform: translate(0, 0);
  position: absolute;
  left: 0;
  width: 66px;
  height: 100%;
}
.slider-move-btn:hover {
  cursor: pointer;
}
</style>
