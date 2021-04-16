<template>
  <div class="setting-drawer">
    <a-drawer
      width="300"
      placement="right"
      :closable="false"
      :visible="visible"
      :drawer-style="{ position: 'absolute' }"
      @close="onClose"
    >
      <div class="setting-drawer-index-content">

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">整体风格设置</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">
                暗色菜单风格
              </template>
              <div class="setting-drawer-index-item" @click="handleNavTheme('dark')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg" alt="dark">
                <div v-if="navTheme === 'dark'" class="setting-drawer-index-selectIcon">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">
                亮色菜单风格
              </template>
              <div class="setting-drawer-index-item" @click="handleNavTheme('light')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg" alt="light">
                <div v-if="navTheme !== 'dark'" class="setting-drawer-index-selectIcon">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>
          </div>
        </div>

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题色</h3>

          <div style="height: 20px">
            <a-tooltip v-for="(item, index) in colorList" :key="index" class="setting-drawer-theme-color-colorBlock">
              <template slot="title">
                {{ item.key }}
              </template>
              <a-tag :color="item.color" @click="changeColor(item.color)">
                <a-icon v-if="item.color === primaryColor" type="check" />
              </a-tag>
            </a-tooltip>

          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">导航模式</h3>

          <div class="setting-drawer-index-blockChecbox">
            <a-tooltip>
              <template slot="title">
                侧边栏导航
              </template>
              <div class="setting-drawer-index-item" @click="handleLayout('side')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg" alt="side">
                <div v-if="layout === 'side'" class="setting-drawer-index-selectIcon">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>

            <a-tooltip>
              <template slot="title">
                顶部栏导航
              </template>
              <div class="setting-drawer-index-item" @click="handleLayout('top')">
                <img src="https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg" alt="top">
                <div v-if="layout === 'top'" class="setting-drawer-index-selectIcon">
                  <a-icon type="check" />
                </div>
              </div>
            </a-tooltip>
          </div>
          <div :style="{ marginTop: '24px' }">
            <a-list :split="false">
              <a-list-item>
                <a-select
                  slot="actions"
                  size="small"
                  style="width: 80px;"
                  :default-value="contentWidth"
                  @change="handleContentWidthChange"
                >
                  <a-select-option v-if="layout === 'top'" value="Fixed">定宽</a-select-option>
                  <a-select-option value="Fluid">流式</a-select-option>
                </a-select>
                <a-list-item-meta>
                  <div slot="title">内容区域宽度</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :default-checked="fixedHeader"
                  @change="handleFixedHeader"
                />
                <a-list-item-meta>
                  <div slot="title">固定 Header</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :disabled="(layout === 'top')"
                  :default-checked="fixSiderbar"
                  @change="handleFixSiderbar"
                />
                <a-list-item-meta>
                  <div slot="title" :style="{ opacity: layout === 'top' ? 0.5: null }">固定侧边菜单</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
        <a-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">其他设置</h3>
          <div>
            <a-list :split="false">
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :default-checked="colorWeak"
                  @change="onColorWeak"
                />
                <a-list-item-meta>
                  <div slot="title">色弱模式</div>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-switch
                  slot="actions"
                  size="small"
                  :default-checked="multiTab"
                  @change="onMultiTab"
                />
                <a-list-item-meta>
                  <div slot="title">多页签模式</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
        </div>
        <a-divider />
        <div :style="{ marginBottom: '24px' }">
          <a-button
            icon="copy"
            block
            @click="doCopy"
          >拷贝设置</a-button>
          <a-alert type="warning" :style="{ marginTop: '24px' }">
            <span slot="message">
              配置栏只在开发环境用于预览，生产环境不会展现，请手动修改配置文件。修改配置文件后，需要清空本地缓存和LocalStorage
              <a href="https://github.com/sendya/ant-design-pro-vue/blob/master/src/config/defaultSettings.js" target="_blank">src/config/defaultSettings.js</a>
            </span>
          </a-alert>
        </div>
      </div>
      <div
        v-if="showHandle"
        slot="handle"
        class="setting-drawer-index-handle"
        @click="toggle"
      >
        <a-icon v-if="!visible" type="setting" />
        <a-icon v-else type="close" />
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { appDefaultSetting } from '@/config/defaultSettings'
import { updateTheme, updateColorWeak, colorList } from './settingConfig'
import { mixin, mixinDevice } from '@/utils/mixin'
import { mapMutations } from 'vuex'
import { APP_MUTATIONS } from '@/store/mutation-types'

export default {
  mixins: [mixin, mixinDevice],
  props: {
    showHandle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      visible: false,
      colorList
    }
  },
  mounted () {
    updateTheme(this.primaryColor)
    if (this.colorWeak !== appDefaultSetting.colorWeak) {
      updateColorWeak(this.colorWeak)
    }
  },
  methods: {
    ...mapMutations(Object.keys(APP_MUTATIONS)),
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    toggle () {
      this.visible = !this.visible
    },
    handleNavTheme (navTheme) {
      this[APP_MUTATIONS.TOGGLE_NAV_THEME](navTheme)
    },
    changeColor (color) {
      if (this.primaryColor !== color) {
        this[APP_MUTATIONS.TOGGLE_PRIMARY_COLOR](color)
        updateTheme(color)
      }
    },
    handleLayout (layout) {
      this[APP_MUTATIONS.TOGGLE_LAYOUT](layout)
    },
    handleContentWidthChange (contentWidthType) {
      this[APP_MUTATIONS.TOGGLE_CONTENT_WIDTH](contentWidthType)
    },
    handleFixedHeader (fixed) {
      this[APP_MUTATIONS.TOGGLE_FIXED_HEADER](fixed)
    },
    handleFixSiderbar (fixed) {
      this[APP_MUTATIONS.TOGGLE_FIXED_SIDERBAR](fixed)
    },
    onColorWeak (colorWeak) {
      this[APP_MUTATIONS.TOGGLE_COLOR_WEAK](colorWeak)
      updateColorWeak(colorWeak)
    },
    onMultiTab (multiTabOpened) {
      this[APP_MUTATIONS.TOGGLE_MULTI_TAB](multiTabOpened)
    },

    doCopy () {
      // get current settings from mixin or this.$store.state.app, pay attention to the property name
      const text = `export default {
        primaryColor: '${this.primaryColor}', // primary color of ant design
        navTheme: '${this.navTheme}', // theme for nav menu
        layout: '${this.layout}', // nav menu position: side or top or mix
        contentWidth: '${this.contentWidth}', // layout of content: Fluid or Fixed, Does not work in side modes
        fixedHeader: ${this.fixedHeader}, // sticky header
        fixSiderbar: ${this.fixSiderbar}, // sticky siderbar
        colorWeak: ${this.colorWeak},
        multiTab: ${this.multiTab}
      }`
      this.$copyText(text).then(message => {
        console.log('copy', message)
        this.$message.success('复制完毕')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
  }
}
</script>

<style lang="less" scoped>

  .setting-drawer-index-content {

    .setting-drawer-index-blockChecbox {
      display: flex;

      .setting-drawer-index-item {
        margin-right: 16px;
        position: relative;
        border-radius: 4px;
        cursor: pointer;

        img {
          width: 48px;
        }

        .setting-drawer-index-selectIcon {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          padding-top: 15px;
          padding-left: 24px;
          height: 100%;
          color: #1890ff;
          font-size: 14px;
          font-weight: 700;
        }
      }
    }
    .setting-drawer-theme-color-colorBlock {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      float: left;
      cursor: pointer;
      margin-right: 8px;
      padding-left: 0px;
      padding-right: 0px;
      text-align: center;
      color: #fff;
      font-weight: 700;

      i {
        font-size: 14px;
      }
    }
  }

  .setting-drawer-index-handle {
    position: absolute;
    top: 240px;
    background: #1890ff;
    width: 48px;
    height: 48px;
    right: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    pointer-events: auto;
    z-index: 1001;
    text-align: center;
    font-size: 16px;
    border-radius: 4px 0 0 4px;

    i {
      color: rgb(255, 255, 255);
      font-size: 20px;
    }
  }
</style>
