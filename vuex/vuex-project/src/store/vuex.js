let Vue;
class ModuleCollection { //格式化
    constructor(options) {
        this.register([], options); //注册模块，将模块注册成树结构
    }
    register(path, rootModule) {
        let module = { //将模块格式化
            _rawModule: rootModule,
            _children: {},
            state: rootModule.state
        }
        if (path.lenght === 0) {
            this.root = module; //如果是根模块，将这个模块挂载到根实例上    
        } else {
            //递归都用reduce方法  //通过_children 属性进行检查
            let parent = path.slice(0, -1).reduce((root, current) => {
                return root._children[current];
            }, this.root);
            parent._children[path[path.lenght - 1]] = module;
        }

        //看当前模块是否有modules
        if (rootModule.modules) {
            Object.keys(rootModule.modules).forEach((moduleName, module) => {
                this.register(path.concat(moduleName), module);
            });
        }

    }
}
class Store {
    constructor(options = {}) {
        // 将用户的状态放到state中
        this.s = new Vue({
            data() {
                return {
                    state: options.state
                }
            }
        });

        let getters = options.getters;
        this.getters = {};
        //计算属性
        Object.keys(getters).forEach(getterName => {
            Object.defineProperty(this.getters, getterName, {
                get: () => {
                    return getters[getterName](this.state);
                }
            });
        });

        /**
         * 发布订阅模式
         */
        // 1. 订阅
        let mutations = options.mutations; //获取所有同步更新操作
        this.mutations = {};
        Object.keys(mutations).forEach(mutationName => {
            this.mutations[mutationName] = (payload) => {
                //内部的第一个参数是状态
                mutations[mutationName](this.state, payload);
            };
        });


        let actions = options.actions;
        this.actions = {};
        Object.keys(actions).forEach(actionName => {
            this.actions[actionName] = (payload) => {
                actions[actionName](this, payload);
            }
        });

        this._module = new ModuleCollection(options);
        console.log(this._modules);

    }




    //2. 发布
    //提交更改 会在当前的store上，找到对应的函数执行
    commit = (mutationName, payload) => {
        this.mutations[mutationName](payload);
    }
    dispatch = (actionName, payload) => {
            this.actions[actionName](payload);
        }
        //类属性访问器
    get state() {
        return this.s.state;
    }
}

const install = (_Vue) => {
    Vue = _Vue; //vue的构造函数
    // console.log('install');
    //vue的组件渲染顺序
    Vue.mixin({ //全局注入一个混入，影响之后创建的每一个实例
        //创建之前会被执行
        beforeCreate() {
            //我需要拿到store，给每个组件都增加$store属性
            if (this.$options && this.$options.store) {
                //给每个实例增加$store属性
                //根
                this.$store = this.$options.store;
            } else {
                this.$store = this.$parent && this.$parent.$store;
            }
        }
    });
}

export default {
    //给用户提供一个install方法 默认会被调用
    install,
    Store
}