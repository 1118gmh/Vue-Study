//这里存放需要后端权限的路由
export default [
    {
        path: "/contact",
        name: "联系我",
        component: () =>
        import ("@/views/Contact/index.vue")
    },
    {
      path: "/service",
      name: "service",
      component: {
          render: h => <h1> 服务 </h1>
      }
  }
]