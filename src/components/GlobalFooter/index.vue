<template>
  <div class="footer">
    <div class="links">
      <a href="https://www.ball.cn/" target="_blank">BallCat 首页</a>
      <a href="https://github.com/hccake/ballcat-ui-vue" target="_blank">
        <a-icon type="github-fill" />
      </a>
      <a href="https://ant.design/">Ant Design</a>
      <a href="https://vue.ant.design/">Vue Antd</a>
      <a href="https://pro.loacg.com/">Vue Antd Pro</a>
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> 2021 <span>🐱 Ballcat 团队出品</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 16px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
