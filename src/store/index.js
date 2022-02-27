import Vue from 'vue';
import Vuex from 'vuex';

// vuex是vue组件状态管理器，用来管理所有组件的公共数据。Vue.use()表示Vue全局注册组件。
Vue.use(Vuex);

// 创建vuex仓库实例并导出模块
export default new Vuex.store({
	// state存储所有组件的状态信息
	state: {
		// routes用来存储后端返回来的路由信息
		routes: []
	
	},
	// mutations定义操作state中状态信息的方法
	mutations: {
		// initRoutes向state.routes里添加数据
		initRoutes(state, data) {
			state.routes = data;
		}
	
	},
	// action定义操作mutations中的方法进而影响state，可做异步方法定义
	action: {
	
	}
});
