<template>
  <div id="app">
    我取到的年龄是{{$store.state.age}}
    我去到的计算属性是{{$store.getters.myAge}}
    <br>
    <button @click="add">点击加10</button>
    <br>
    <button @click="minus">异步减少</button>
    <br>
    模块中的数据：{{$store.state.a.a}}
  </div>
  
</template>

<script>
export default{
  
  mounted () {
    // console.log(this);
    // setInterval(() => {
    //   this.$store.state.age ++;
    // }, 1000);
    console.log(this.$store);
  },

  methods: {
    add(){
      this.$store.commit('syncAdd', 10)
    },
    minus(){
      this.$store.dispatch('asyncMinus',5);
    }

  }

}
</script>


