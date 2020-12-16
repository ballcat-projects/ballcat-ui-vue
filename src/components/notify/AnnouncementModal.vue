<template>
</template>

<script>
import { Modal } from 'ant-design-vue'

export default {
  name: 'AnnouncementPage',
  methods: {
    show(announcement){
      Modal.info({
        title: announcement.title,
        width: 800,
        // JSX support
        icon: function (){
          return (
            <a-icon type="notification" theme="filled"/>
          )
        },
        content: (
          <div domPropsInnerHTML={announcement.content}/>
        )
      })
    }
  }
}
</script>

