<template>
	<div style="width: 500px">
		<el-input
				placeholder="请输入部门名称"
				v-model="filterText">
		</el-input>
		
		<el-tree
				class="filter-tree"
				:data="depts"
				:props="defaultProps"
				:filter-node-method="filterNode"
				:expand-on-click-node="false"
				ref="tree">
			<!-- display: flex表示容器水平分布，justify-content: flex-end表示容器内部元素水平靠后分布，space-between表示容器内部元素从两边开始分布		-->
			<!-- slot-scope="{ node, data }传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据，Node对象属性就是当前的树节点对象，data是当前节点的JSON数据即this.depts中的元素 	-->
			<span class="custom-tree-node" style="display: flex; justify-content: space-between; width: 500px" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
					<!-- CSS中padding表示元素边框与元素内容之间的空间，表示内边距，margin表示元素边框之间空间，表示外边距 -->
          <el-button
		          class="depBut"
		          type="primary"
		          size="mini"
		          @click="() => append(data)">
            添加
          </el-button>
          <el-button
		          class="depBut"
		          type="danger"
		          size="mini"
		          @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
		</el-tree>
	</div>
</template>

<script>
export default {
	name: "DepMana",
	data() {
		return {
			filterText: '',
			depts: [],
			defaultProps: {
				children: 'children',
				label: 'name'
			}
		}
	},
	mounted() {
		this.initDepts();
	},
	// watch属性定义监听data中的数据变化，watch定义格式详见vue文档
	watch: {
		// 监听filterText值的变化，val新值、oldVal旧值
		filterText(val, oldVal) {
			// 找到注册过ref属性的DOM集合，通过ref=tree获取DOM，调用 Tree 实例的filter方法，此时el-tree需要设置filter-node-method，值为过滤函数。
			// filter接收一个任意类型的参数，该参数会在 filter-node-method 中作为第一个参数
			this.$refs.tree.filter(val);
		}
	},
	methods: {
		remove(node, data) {
			console.log(node);
			console.log(data);
			
			
		},
		append(data) {
			console.log(data);
			
		},
		// el-tree的过滤函数filter-node-method默认传过来value、data，value是当前输入框的值即this.filterText的值，data是树中一个节点的JSON数据，即this.depts中的元素
		// filter-node-method绑定的回调函数对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
		filterNode(value, data) {
			console.log(value);
			console.log(data);
			// 没有输入数据，显示所有树节点；节点匹配显示节点
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},
		initDepts() {
			this.getRequest('/system/basic/department/').then(resp => {
				if (resp) {
					this.depts = resp;
				}
			})
		}
	}
}
</script>

<style>
	.depBut {
		padding: revert;
	}

</style>
