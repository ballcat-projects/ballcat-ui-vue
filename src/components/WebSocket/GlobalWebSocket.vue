<template>
  <global-web-socket-listener/>
</template>
<script>
import { ACCESS_TOKEN } from '@/store/storage-types'
import Vue from 'vue'
import GlobalWebSocketListener from '@/components/WebSocket/GlobalWebSocketListener'

export default {
  components: { GlobalWebSocketListener },
  data () {
    return {
      webSocket: null, // webSocket实例
      lockReconnect: false, // 重连锁，避免多次重连
      maxReconnect: -1,  // 最大重连次数， -1 标识无限重连
      reconnectTime: 0, // 重连尝试次数
      heartbeat: {
        interval: 30 * 1000, // 心跳间隔时间
        timeout: 10 * 1000, // 响应超时时间
        pingTimeoutObj: null, // 延时发送心跳的定时器
        pongTimeoutObj: null, // 接收心跳响应的定时器
        pingMessage: JSON.stringify({ type: 'ping' }) // 心跳请求信息
      }
    }
  },
  created () {
    this.initWebSocket()
  },
  destroyed: function () {
    this.webSocket.close()
    this.clearTimeoutObj(this.heartbeat)
  },
  methods: {
    /**
     * 初始化 weoSocket
     */
    initWebSocket () {
      // ws地址
      const token = Vue.ls.get(ACCESS_TOKEN)
      const wsUri = 'ws://127.0.0.1:8080/ws?access_token=' + token
      // 建立连接
      this.webSocket = new WebSocket(wsUri)
      // 连接成功
      this.webSocket.onopen = this.onOpen
      // 连接错误
      this.webSocket.onerror = this.onError
      // 接收信息
      this.webSocket.onmessage = this.onMessage
      // 连接关闭
      this.webSocket.onclose = this.onClose
    },
    /**
     * 重新连接
     */
    reconnect () {
      if (this.lockReconnect || (this.maxReconnect !== -1 && this.reconnectTime > this.maxReconnect)) {
        return
      }
      this.lockReconnect = true
      setTimeout(() => {
        this.reconnectTime++
        // 建立新连接
        this.initWebSocket()
        this.lockReconnect = false
      }, 5000)
    },
    /**
     * 清空定时器
     */
    clearTimeoutObj: function (heartbeat) {
      heartbeat.pingTimeoutObj && clearTimeout(heartbeat.pingTimeoutObj)
      heartbeat.pongTimeoutObj && clearTimeout(heartbeat.pongTimeoutObj)
    },
    /**
     * 开启心跳
     */
    startHeartbeat () {
      const webSocket = this.webSocket
      const heartbeat = this.heartbeat
      // 清空定时器
      this.clearTimeoutObj(heartbeat)
      // 延时发送下一次心跳
      heartbeat.pingTimeoutObj = setTimeout(() => {
        // 如果连接正常
        if (webSocket.readyState === 1) {
          //这里发送一个心跳，后端收到后，返回一个心跳消息，
          webSocket.send(heartbeat.pingMessage)
          // 心跳发送后，如果服务器超时未响应则断开，如果响应了会被重置心跳定时器
          heartbeat.pongTimeoutObj = setTimeout(() => {
            webSocket.close()
          }, this.timeout)
        } else {
          // 否则重连
          this.reconnect()
        }
      }, heartbeat.interval)
    },
    /**
     * 连接成功事件
     */
    onOpen () {
      console.log('WebSocket connection success')
      //开启心跳
      this.startHeartbeat()
      this.reconnectTime = 0
    },
    /**
     * 连接失败事件
     * @param e
     */
    onError (e) {
      //错误
      console.log('WebSocket connection error (' + e.reason + ')')
      //重连
      this.reconnect()
    },
    /**
     * 连接关闭事件
     * @param e
     */
    onClose (e) {
      //关闭
      console.log('WebSocket connection closed (' + e.reason + ')')
      //重连
      this.reconnect()
    },
    /**
     * 接收服务器推送的信息
     * @param msgEvent
     */
    onMessage (msgEvent) {
      //收到服务器信息，心跳重置并发送
      this.startHeartbeat()
      let event;
      let data;
      const text = msgEvent.data
      try {
        data = JSON.parse(text)
        event = data.type
        // 心跳响应跳过发布
        if(event === 'pong'){
          return
        }
      }catch (e) {
        // 纯文本消息
        event = 'plaintext'
        data = text
      }
      this.$bus.$emit(event, data);
    },
    /**
     * 数据发送
     * @param msg
     */
    send (msg) {
      //数据发送
      this.webSocket.send(msg)
    }
  }
}

</script>
