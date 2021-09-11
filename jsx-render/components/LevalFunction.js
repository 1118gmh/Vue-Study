//函数组件
export default {
    props: {
        type: {
            type: String
        }
    },
    render(h) { // eslint-disable-line no-unused-vars
        //jsx  => js + xml
        //<>都是html，{}是js
        let tag = 'h' + this.type; 
        return <tag a = { 1 } > { this.$slots.default } </tag>;

        //render中的this只带的是我们组件的实例
        // return h('h' + this.type, {}, this.$slots.default);
    }
}