<template>
	<div>
		<!-- el-form是ElementUI的表单元素，rules属性表示对表单输入值进行校验（具体的规则由rules指定）；model属性表示表单数据对象，即用户输入的值由model指定的对象接收；-->
		<!-- 表单验证必须由rules、model配合，校验是通过rules.prop与model.prop是否匹配，做出响应行为 -->
		<el-form v-bind:rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
			<h3 class="loginTitle">系统登录</h3>
			<!--	el-form-item表单项，prop定义表单项的名字便于查找，label表示表单项前的标签	-->
			<el-form-item label="用户名" prop="username">
				<!--	el-input输入标签，type表示输入框性质（text表示文本，password表示密码框），auto-complete是否自动补全，placeholder当输入框为空时默认显示信息		-->
				<el-input type="text" v-model="loginForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
				
			</el-form-item>
			
			<el-form-item label="密码" prop="password">
				<el-input type="password" v-model="loginForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
				
			</el-form-item>
			
			<!-- el-button 表示按钮，type表示按钮的已定义的样式，style定义按钮个性化样式 -->
			<el-button type="primary" style="width: 100%;" @click="loginSubmit">登录</el-button>
		</el-form>
	</div>

</template>

<script>
// 导入api.js中的请求配置
// import { postKeyValueRequest } from '../utils/api.js'

export default {
	name: "Login",
	data() {
		return {
			loginForm: {
				username: 'root',
				password: '1234'
			},
			rules: {
				// loginForm定义用户的用户名和密码
				// rules定义校验规则，key必须与表单项的prop属性一致，才能被匹配上。
				// 定义prop=username的表单项。required表示是否校验，message表示默认提示，trigger表示触发方式
				username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
				password: [{required: true, message: '请输入密码', trigger: 'blur'}]
			
			}
		}
	},
	methods: {
		loginSubmit() {
			// $refs是Vue实例属性持有注册过ref属性的所有DOM元素和组件实例
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					// 调用post方式的网络请求，地址/doLogin，参数是loginForm。then(resp)表示这个请求执行后的回调，resp是请求获取到的服务端响应信息（因为在axios中的响应拦截器里处理过响应，该处resp信息是处理过返回的信息）
					this.postKeyValueRequest('/doLogin', this.loginForm).then(resp => {
						if (resp) {
							// 如果拦截器返回了信息，则把该信息存储在当前页面的sessionStorage中，key是'user'。
							// sessionStorage设置的页面会话在浏览器打开期间一直保持，重新加载或恢复页面仍会保持原来的会话；
							// 新窗口打开时将上层浏览器会话上下文作为新会话上下文；
							// 打开多个相同的URL的tabs页面，会创建各自的sessionStorage；
							// 关闭对应浏览器标签或窗口，会清除对应的sessionStorage；
							window.sessionStorage.setItem('user', JSON.stringify(resp.obj));
							
							// 因在Vue中路由已通过Vue.use(Route)的方式注册到Vue中，main.js不同的是先直接将配置好的路由注册到Vue实例中。
							// 而每个Vue的组件通过路由的方式注册到Vue实例中，对于Vue组件来说可通过this.$router的方式访问路由实例。
							// this.$router当前Vue组件页面访问路由实例，replace、push均可实现路由跳转，push()参数可以是路由字符串、{path: ''}对象等，
							// 不同的是push将当前页面压入history中，而replace则直接覆盖，即前者还可访问上一级页面，后者不行。
							this.$router.replace({path: '/home'})
							
						}
					})
				} else {
					// $message弹框显示信息
					this.$message('请完善信息');
					return false;
				}
			});
		}
	}
}
</script>

<style scoped>

	.loginContainer {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 180px auto;
		width: 350px;
		padding: 35px 35px 15px 35px;
		background: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}
	.loginTitle {
		margin: 15px auto 20px auto;
		text-align: center;
		color: #505458;
	}

</style>
