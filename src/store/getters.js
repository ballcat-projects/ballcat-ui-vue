const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  userInfo: state => state.user.info,
  userRouters: state => state.userRouter.userRouters,
  multiTab: state => state.app.multiTab,
  lang: state => state.i18n.lang
}

export default getters
