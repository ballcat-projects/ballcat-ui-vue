<template>
  <div class="text-container" v-if="announcementNum > 0">
    <transition class="" name="slide" mode="out-in">
      <span :key="announcement.id" class="announcement-content">
        <a-icon type="sound" theme="filled"/>
        <a href="javascript:" class="text" @click="readAnnouncement">{{ announcement.title }}</a>
      </span>
    </transition>
    <announcement-modal ref="announcementModal"></announcement-modal>
  </div>
</template>

<script>
import AnnouncementModal from '@/components/notify/AnnouncementModal'
import { getUserAnnouncements, readAnnouncement } from '@/api/notify/announcement'

export default {
  name: 'AnnouncementRibbon',
  components: { AnnouncementModal },
  data () {
    return {
      activeIndex: 0, // 当前索引
      intervalId: null, // 定时器ID
      playTime: 4000, // 定时器执行间隔
      announcements: [] // 公告信息
    }
  },
  computed: {
    announcementNum () {
      return this.announcements.length
    },
    announcement () {
      return this.announcements[this.activeIndex]
    }
  },
  created () {
    // 获取公告信息
    getUserAnnouncements().then(res => {
      this.announcements = res.data
    })
    // 定义定时器
    this.intervalId = setInterval(() => {
      if (this.activeIndex < this.announcementNum - 1) {
        this.activeIndex++ // 自增
      } else {
        this.activeIndex = 0
      }
    }, this.playTime)
    // 注册监听事件
    this.$bus.$on('announcement-push', this.onAnnouncementPush)
    this.$bus.$on('announcement-close', this.onAnnouncementClose)

  },
  destroyed () {
    // 清除定时器
    clearInterval(this.intervalId)
    // 删除事件监听
    this.$bus.$off('announcement-push', this.onAnnouncementPush)
    this.$bus.$off('announcement-close', this.onAnnouncementClose)
  },
  methods: {
    readAnnouncement () {
      // 展示公告
      this.$refs.announcementModal.show(this.announcement)
    },
    onAnnouncementPush: function (data) {
      // 添加公告
      let announcement = {
        id: data.id,
        title: data.title,
        content: data.content
      }
      this.announcements.push(announcement)
    },
    onAnnouncementClose: function (data){
      this.announcements.splice( this.announcements.findIndex(item => item.id === data.id), 1)
    }
  }
}
</script>

<style scoped>

.text-container {
  font-size: 14px;
  color: #f56b6b;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  min-height: 32px;
  position: relative;
  background: rgb(230, 247, 255);
  padding-left: 18px;
}

.text {
  color: #f56b6b;
  display: inline;
  padding-left: 12px
}

.announcement-content {
  width: 100%;
  position: absolute;
  text-align: left;
  line-height: 32px;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.8s linear;
}

.slide-enter {
  transform: translateY(20px);
  opacity: 1;
}

.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>

