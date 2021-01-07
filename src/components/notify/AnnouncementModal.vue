<template>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { readAnnouncement } from '@/api/notify/announcement'

export default {
  name: 'AnnouncementModal',
  methods: {
    show (announcement, isPreview = false) {
      Modal.info({
        title: announcement.title,
        width: 800,
        // JSX support
        icon: function () {
          return (
            <a-icon type="notification" theme="filled"/>
          )
        },
        content: (
          <div domPropsInnerHTML={announcement.content}/>
        ),
        onOk: function () {
          if (!isPreview) {
            return readAnnouncement(announcement.id)
          }
        }
      })
    }
  }
}
</script>

