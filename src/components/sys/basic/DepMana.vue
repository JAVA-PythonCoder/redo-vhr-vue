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
			<!-- slot-scope="{ node, data }传入两个参数node和data，分别表示当前节点的 Node 对象为当前节点的数据，Node对象就是当前的树节点对象，data是当前节点的JSON数据即this.depts中的元素 	-->
			<span class="custom-tree-node" style="display: flex; justify-content: space-between; width: 500px" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
					<!-- CSS中padding表示元素边框与元素内容之间的空间，表示内边距，margin表示元素边框之间空间，表示外边距 -->
          <el-button
		          class="depBut"
		          type="primary"
		          size="mini"
		          @click="() => showAddView(data)">
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
		<div>
			<el-dialog
					title="添加部门"
					:visible.sync="dialogVisible"
					width="30%">
				<table>
					<tr>
						<td>上级部门：</td>
						<td>
							<el-tag>{{parentName}}</el-tag>
						</td>
					</tr>
					<tr>
						<td>添加部门：</td>
						<td><el-input v-model="addDept.name" placeholder="请输入要添加的部门..."></el-input></td>
					</tr>
				</table>
				<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="doAddDept">确 定</el-button>
        </span>
			</el-dialog>
		</div>
	</div>
</template>

<script>
export default {
	name: "DepMana",
	data() {
		return {
			parentName: '',
			addDept: {
				name: '',
				parentId: -1
			},
			dialogVisible: false,
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
		// 动态修改元素实现刷新
		updateDepts(depts, data) {
			for (let i = 0; i < depts.length; i++) {
				if (depts[i].id == data.parentId) {
					// 数组方法：b.concat(a)拼接两个数组为一个新数组，a可为一个元素；b.push(a)将元素a添加到数组b末尾
					depts[i].children.push(data);
					return;
				} else {
					this.updateDepts(depts[i].children, data);
				}
			}
			
		},
		// 增加部门都是在父部门下添加新子部门
		doAddDept() {
			this.postRequest('/system/basic/department/', this.addDept).then(resp => {
				if (resp) {
					// 不宜直接this.initDepts()方式刷新树，导致添加部门后刷新折叠不便于找到添加的部门。
					// 树是通过绑定depts获取值的，而depts形如[{label,children{label, children{...}}}]不断嵌套children对象从而显示子树。所以为方便添加后不折叠，可改变刷新的depts
					this.updateDepts(this.depts, resp.obj);
					this.parentName = '';
					this.addDept = {
						name: '',
						parentId: -1
					};
					this.dialogVisible = false;
				}
			})
			
			
		},
		updateDel(depts, id) {
			for (let i = 0; i < depts.length; i++) {
				let d = depts[i];
				if (d.id == id) {
					// arr.splice(start, count, addEle1, addEle2, ...)，splice删除原数组一部分内容或删除后添加一些内容。start表示起始位置，count表示删除多少个元素，addEle表示在start开始删除count元素后加入的元素。
					depts.splice(i, 1);
					return;
				} else {
					this.updateDel(depts.children, id);
				}
			}
		},
		// 删除部门操作，只能删除树中部门下没有员工的叶子部门
		remove(node, data) {
			console.log(node);
			console.log(data);
			this.$confirm('此操作将永久删除'+ node.label +'部门, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/system/basic/department/' + data.id).then(resp => {
					if (resp) {
						this.updateDel(this.depts, data.id);
					}
				})
				
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
			
			
			
		},
		showAddView(data) {
			console.log(data);
			this.parentName = data.name;
			this.addDept.parentId = data.id;
			this.dialogVisible = true;
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
