//vue响应式原理

let proto = Object.create(Array.prototype);
["push", "unshift", "splice"].forEach(item => {
    proto[item] = function(...args) {
        let inserted;
        switch (item) {
            case "push":
            case "unshift":
                inserted = args
                break;
            case "splice":
                inserted = args.splice(2);
            default:
                break;
        }
        console.log('视图更新');
        args.forEach(item => {
            observer(item);
        });
        Array.prototype[item].call(this, ...args);
    };
});

function observer(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (obj instanceof Array) {
        //push shift splice 这三个方法可能会增加对象，应该判断一下是否是对象
        Object.setPrototypeOf(obj, proto); //实现对数组方法的重写
        obj.forEach(item => {
            observer(item);
        });
        return obj;
    }
    for (let key in obj) {
        //默认只循环一层
        defineReactive(obj, key, obj[key]);
    }

}

function defineReactive(obj, key, value) {
    observer(value); //递归创建 响应式数据，性能不好
    Object.defineProperty(obj, key, {
        get() {
            return value;
        },
        set(newValue) {
            if (value !== newValue) {
                observer(newValue);
                value = newValue;
                console.log('视图更新');
            }
        }
    });
}


// let obj = {
//     name: 'gmh',
//     age: 1,
//     parent: [{
//         name: 'xiaogang',
//         age: 111
//     }, {
//         name: 'xiaohong',
//         age: 222
//     }]
// };

obj = {
    n: [1, 2, 3, { m: 1 }]
};
observer(obj);
obj.n.push({ a: 1, b: { k: 4 } })
    // obj.n.length--;
    // obj.n[3].m = 2
    // console.log(obj.n[4].b.k);

// 1. 增加不存在的属性不能更新视图
// 2. 默认会递归增加 getter和setter
// 3. 数组套对象 对象是支持响应式变化的，如果常量则没有效果
// 4. 修改数组索引和长度是不会导致视图更新的
// 5. 如果新增的数据vue中也会监控