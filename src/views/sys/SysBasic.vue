<template>
	<div>
		<!-- el-tabs是选项卡，value属性表示根据标签页中的name属性值默认显示的标签页	-->
		<!-- 对于复杂的页面，可将页面分为多个显示部分，将其封装为一个个的组件，再讲组件注册到当前页面中，同时在页面中引用组件	-->
		<el-tabs v-model="activeName" type="card">
			<!-- el-tab-pane是选项卡中的标签页，label选项卡标题	-->
			<el-tab-pane label="部门管理" name="first"><DepMana></DepMana></el-tab-pane>
			<el-tab-pane label="职位管理" name="second"><PosMana></PosMana></el-tab-pane>
			<el-tab-pane label="职称管理" name="third"><JobLevelMana></JobLevelMana></el-tab-pane>
			<el-tab-pane label="奖惩规则" name="fourth"><EcMana></EcMana></el-tab-pane>
			<el-tab-pane label="权限组" name="five"><PermissionMana></PermissionMana></el-tab-pane>
		</el-tabs>
	</div>

</template>

<script>
import DepMana from '../../components/sys/basic/DepMana'
import EcMana from '../../components/sys/basic/EcMana'
import JobLevelMana from '../../components/sys/basic/JobLevelMana'
import PermissionMana from '../../components/sys/basic/PermissionMana'
import PosMana from '../../components/sys/basic/PosMana'

export default {
	name: "SysBasic",
	data() {
		return {
			activeName: 'second'
			
		}
	},
	// 将标签页内容作为组件注册到页面中。在Vue项目中组件和页面都是vue文件，不同的是页面有路由定义访问，而组件通过注册在页面里通过html元素的方式访问。
	components: {
		DepMana,
		EcMana,
		JobLevelMana,
		PermissionMana,
		PosMana
	}
}
</script>

<style scoped>

</style>
