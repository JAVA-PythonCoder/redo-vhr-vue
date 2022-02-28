<template>
	<div>
		<!-- 布局容器组件：el-container(父容器)、el-header(子容器：顶栏容器)、el-aside(子容器：侧边栏容器)、el-main(子容器：主要区域容器)、el-footer(子容器：底栏容器)	-->
		<el-container>
			
			<el-header class="homeHeader">
				
				<div class="title">人事管理</div>
				
				<!-- el-dropdown下拉菜单域，command指令用于绑定函数处理el-dropdown-item的command点击菜单项触发时的回调值value	-->
				<el-dropdown class="userInfo" v-on:command="commandHandler">
					<!-- 下拉菜单域展示的名字 -->
				  <span class="el-dropdown-link">
				    {{ user.name }}<i><img :src="user.userface"></i>
				  </span>
					
					<!-- 下拉菜单：slot=dropdown表示下拉列表，command=value点击菜单项触发的事件回调 -->
					<el-dropdown-menu slot="dropdown">
						<!-- 下拉菜单项						-->
						<el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
						<el-dropdown-item command="setting">设置</el-dropdown-item>
						<el-dropdown-item divided command="logout">注销登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				
			</el-header>
			
			<el-container>
				<!-- 侧边栏设置导航 -->
				<el-aside width="200px">
					<!-- el-menu导航栏。导航栏中菜单项的点击触发事件由el-menu属性select负责，select会从菜单项中接收两个参数index(选中菜单项(el-menu-item)的 index)和indexPath(选中菜单项的 index path) -->
					<!-- router属性表示使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转，即点击菜单项时触发index指向的地址	-->
					<!-- unique-opened表示只打开单一菜单					-->
					<!-- <el-menu @select="menuClick">-->
					<el-menu router unique-opened>
						<!-- this.$router.options获取到的是路由配置对象router，	this.$router.options.routes则获取到是路由配置数组。因为在每个路由配置里添加了hidden属性作为过滤 -->
						<!-- submenu中的index用于定位下拉列表，相同值的index下拉列表会同时触发 -->
						<el-submenu :index="index + ''" v-for="(item, index) in routes" v-if="!item.hidden" :key="index">
							<!-- i元素中的class属性用于可用于展示图标（本项目用的是font-awesome图标库）-->
							<template slot="title"><i :class="item.iconCls" style="margin: 5px"></i>{{ item.name }}</template>
								<el-menu-item :index="child.path" v-for="(child, indexj) in item.children" :key="indexj">{{ child.name }}</el-menu-item>
						</el-submenu>
					</el-menu>
					
				</el-aside>
				
				<el-main>
					<!-- this.$router.currentRoute获取当前页面的路由对象。el-breadcrumb是elementUI的面包屑导航-->
					<el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path != '/Home'">
						<el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
						<el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
					</el-breadcrumb>
					<div class="homeWelcome" v-if="this.$router.currentRoute.path == '/Home'">
						欢迎来到人事管理系统
					</div>
					<router-view></router-view>
				</el-main>
				
			</el-container>
			
		</el-container>
	</div>

</template>

<script>
	export default {
		name: "Home",
		data() {
			return {
				user: JSON.parse(window.sessionStorage.getItem('user'))
			}
		},
		computed: {
			routes() {
				return this.$store.state.routes;
			}
			
		},
		methods: {
			// 导航栏菜单项点击事件，默认会传递两个参数
			menuClick(index, indexPath) {
				console.log(index);
				console.log(indexPath);
				// 利用菜单项传过来的index进行页面跳转（因在父组件的路由中定义了子路由，则子路由可展示在组件的router-view中）
				this.$router.push(index);
			},
			// commandHandler(cmd)被el-dropdown绑定，接收el-dropdown-item的command点击触发时回调的值value，根据不同的值进行消息弹框
			commandHandler(cmd) {
				// 如果cmd接收的是logout表示需要注销操作
				if (cmd == 'logout') {
					// $confirm(message, title, options)表示打开消息提示，参数：message表示触发时的弹框提醒信息，title必须为String类型弹框的title，options必须为如下类型表示不同操作会回调的操作
					this.$confirm('此操作将注销登录, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// then()表示‘确定’的回调。发送到后端的/logout接口注销登录，同时删除sessionStorage中的用户信息，并跳转到登录页面
						this.getRequest('/logout');
						window.sessionStorage.removeItem('user');
						// 用户退出登录时，要清空用户的vuex中的路由状态信息
						this.$store.commit('initRoutes', []);
						this.$router.replace('/');
					}).catch(() => {
						// catch()表示‘取消’的回调。因为在main.js中的Vue.use注册了element UI，所以可直接使用实例方法。
						this.$message({
							type: 'info',
							message: '已注销登录'
						});
					});
				}
			}
		}
	}
</script>

<style scoped>

.homeWelcome {
	text-align: center;
	font-size: 30px;
	font-family: 华文行楷;
	color: #409eff;
	padding-top: 50px;
}


.homeHeader {
	background-color: #409eff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0px 15px;
	box-sizing: border-box;
}

.homeHeader .title {
	font-size: 30px;
	font-family: 华文行楷;
	color: #ffffff
}

.homeHeader .userInfo {
	cursor: pointer;
}

.el-dropdown-link img {
	width: 48px;
	height: 48px;
	border-radius: 24px;
	margin-left: 8px;
}

.el-dropdown-link {
	display: flex;
	align-items: center;
}


</style>
