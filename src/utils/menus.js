import { getRequest } from './api.js'

// 不同的用户有不同的权限，需要展示个性化的页面。后端将用户按照角色分类，不同的角色对应不同的展示页面。
// 根据后端返回的用户页面信息，初始化vuex中state中的routes，则用户根据vuex中的routes确定用户路由信息。
// initMenu两个参数：router路由管理器对象，store状态管理器对象
export const initMenu = (router, store) => {
	// 判断当前仓库状态里路由状态是否有内容，有内容直接返回
	if (store.state.routes.length > 0) {
		return;
	}
	// 没有内容，请求后端接口，获取信息并处理，加入store.state.routes中
	getRequest('/system/config/menu').then(data => {
		if (data) {
			// 处理后端菜单数据
			let fmtRoutes = formatRoutes(data);
			// Vue2中有两种向路由中添加路由记录的方法
			// 1、addRoute添加一条新的路由记录到路由表中（如果路由有一个 name，并且已经有一个与之名字相同的路由，它会先删除之前的路由。）
			// 2、addRoutes添加多条路由记录（该方法已标记废弃）
			// fmtRoutes.forEach(route => {
			// 	router.addRoute(route);
			// })
			router.addRoutes(fmtRoutes);
			// commit()调用vuex的mutations中的initRoutes方法并传参fmtRoutes，初始化vuex中的state.routes状态。
			store.commit('initRoutes', fmtRoutes);
			
		
		
		}
	})
};

// formatRoutes后端返回信息的格式化处理（后端返回的是JSON数据，不符合vue中的路由配置，需要对其进行处理。），参数routes接收后端返回的路由信息
export const formatRoutes = (routes) => {
	let fmRoutes = [];
	// 遍历routes数组每个成员，并进行处理
	routes.forEach(router => {
		// 批量赋值，将router中的属性值赋值到对应变量名上，同时对子菜单children递归处理，即path = router.path等
		// let（块级作用域）声明的变量只在let所在的代码块内有效，且无变量提升；var没有块级作用域，一般是函数或全局作用域
		let {
			path,
			name,
			component,
			meta,
			iconCls,
			children
		} = router;
		// children定义子菜单，如果子菜单存在且为数组实例则需要对其进行格式化处理
		if (children && children instanceof Array) {
			children = formatRoutes(children);
		}
		// fmRouter存储处理后的菜单
		let fmRouter = {
			path: path,
			name: name,
			iconCls: iconCls,
			meta: meta,
			children: children,
			// 对每个component属性处理。因为后端传来的component是JSON，需要在运行时判断动态地将每个组件模块引入
			component(resolve) {
				if (component.startsWith('Home')) {
					// JS中require本质上是赋值过程，在运行时调用。
					// require基本用法：在导出的文件中使用model.exports{}/exports{}对模块中的数据导出，使用require()引入到需要的文件中
					require(['../views/' + component + '.vue'], resolve);
				} else if (component.startsWith('Per')) {
					require(['../views/per/' + component + '.vue'], resolve);
				}else if (component.startsWith('Emp')) {
					require(['../views/emp/' + component + '.vue'], resolve);
				} else if (component.startsWith('Sal')) {
					require(['../views/sal/' + component + '.vue'], resolve);
				} else if (component.startsWith('Sta')) {
					require(['../views/sta/' + component + '.vue'], resolve);
				}else if (component.startsWith('Sys')){
					require(['../views/sys/' + component + '.vue'], resolve);
				}
				
			}
		}
		// 将处理好后的菜单添加到fmRoutes中
		fmRoutes.push(fmRouter);
	});
	return fmRoutes;

}
