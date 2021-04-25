import Loading from "../components/loading";
const loadable = asyncFunction => {
    const component = () => ({
        component: asyncFunction(),
        loading: Loading
    });
    //最终返回一个组件，组件需要有render，通过然的人再去渲染一个异步组件
    return {
        render: h => h(component)
    };
};
export default loadable;