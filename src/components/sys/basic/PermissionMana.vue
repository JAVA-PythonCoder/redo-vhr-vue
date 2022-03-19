<template>
	<div>
		<div class="permissionManaTool">
			<el-input placeholder="请输入角色英文名" size="small" v-model="role.name">
				<template slot="prepend">ROLE_</template>
			</el-input>
			<el-input placeholder="请输入角色中文名" size="small" v-model="role.nameZh"></el-input>
			<el-button size="small" type="primary" icon="el-icon-plus" @click="addRole">添加</el-button>
		</div>
		<div style="margin-top: 5px; width: 60%">
			<!-- 折叠框，v-model绑定的值通过匹配el-collapse-item的name属性，表示默认显示的子折叠框。
					 change属性用于触发点击折叠框时的回调，回调函数change(array/string)，子折叠框name(name值取的是角色的id)的值会被回传给回调函数。
			-->
			<el-collapse
					@change="change"
					v-model="activeName"
					accordion>
				<!--	在vue循环中，对于每个迭代项要设置key（唯一）的值，避免对其中一个迭代项的操作影响其他的迭代项。	-->
				<el-collapse-item v-for="(role, index) in roles" :title="role.nameZh" :name="role.id" :key="index">
					<div>
						<el-card class="box-card">
							<div slot="header" class="clearfix">
								<span>可访问的资源</span>
								<el-button style="float: right; padding: 3px 0; color: red" type="text" icon="el-icon-delete" @click="deleteRole(role)"></el-button>
							</div>
							<div>
								<!-- show-checkbox属性表示是否显示多选框，default-expanded-keys和default-checked-keys设置默认展开和默认选中的节点，
										 必须配合node-key，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。
										 ref是vue中属性，设置节点的引用，可通过Vue实例的$refs.tree引用，$refs引用的是一个注册过ref的DOM元素数组，tree可指定具体的DOM元素。
										 因为树在循环体中，设置key的值便于树之间的影响。
								-->
								<el-tree
										:data="allMenus"
										:props="defaultProps"
										node-key="id"
										ref="tree"
										:key="index"
										:default-checked-keys="selectedMenus"
										show-checkbox>
								</el-tree>
							</div>
							<div style="display: flex; justify-content: flex-end">
								<el-button size="mini" @click="cancelUpdate">取消修改</el-button>
								<el-button size="mini" type="danger" @click="doUpdate(role.id, index)">确认修改</el-button>
								
							</div>
						</el-card>
					</div>
				</el-collapse-item>
			</el-collapse>
			
		</div>
	</div>
</template>

<script>
export default {
	name: "PermissionMana",
	data() {
		return {
			activeName: -1,
			// el-tree中子树内容由children、label指定的属性指定
			defaultProps: {
				id: 'id',
				children: 'children',
				label: 'name'
			},
			selectedMenus: [],
			// el-tree树的所有子树信息都从allMenus中根据defaultProps指定的属性名获取
			allMenus: [],
			roles: [],
			role: {
				name: '',
				nameZh: ''
			}
		}
	},
	mounted() {
		this.initRoles();
	},
	methods: {
		deleteRole(role) {
			this.$confirm('此操作将永久删除'+ role.nameZh +'角色, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteRequest('/system/basic/permission/role/' + role.id).then(resp => {
					if (resp) {
						this.initRoles();
					}
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		addRole() {
			if (this.role.name && this.role.nameZh) {
				let role = {};
				Object.assign(role, this.role);
				if (!role.name.startsWith('ROLE_')) {
					role.name = 'ROLE_' + role.name;
				}
				this.postRequest('/system/basic/permission/', role).then(resp => {
					if (resp) {
						this.initRoles();
						this.role = {
							name: '',
							nameZh: ''
						}
					}
				});
			} else {
				this.$message.info("角色英文名和中文名不能为空");
			}
			
		},
		cancelUpdate() {
			this.activeName = -1;
		},
		doUpdate(id, index) {
			console.log(id);
			// this.$refs引用所有注册过ref属性的DOM元素（数组），this.$refs.tree表示ref=tree的DOM元素被选中，在elementUi中el-tree元素拥有方法getCheckedKeys()默认获取树中所有选中的节点，true是选中树的叶子节点
			let tree = this.$refs.tree[index];
			let selectedKeys = tree.getCheckedKeys(true);
			console.log(tree);
			console.log(selectedKeys);
			
			let url = '/system/basic/permission/?rid=' + id;
			selectedKeys.forEach(key => {
				url += '&mids=' + key;
			})
			
			this.putRequest(url).then(resp => {
				if (resp) {
					this.initSelectedMenus(id);
					this.activeName = id;
				}
			})
			
			
		},
		initSelectedMenus(rid) {
			this.getRequest('/system/basic/permission/mids/' + rid).then(resp => {
				if (resp) {
					this.selectedMenus = resp;
				}
			})
		},
		// 打开、关闭子折叠框都会触发该回调方法，但不同的是前者会回传子折叠框的name值，后者不会。
		change(rid) {
			if (rid) {
				this.initAllMenus();
				this.initSelectedMenus(rid)
			}
		},
		initAllMenus() {
			this.getRequest('/system/basic/permission/menus').then(resp => {
				if (resp) {
					this.allMenus = resp;
				}
			})
			
		},
		initRoles() {
			this.getRequest('/system/basic/permission/').then(resp => {
				if (resp) {
					this.roles = resp;
				}
			})
		}
	}
}
</script>

<style>
	/* css中display属性规定了生成的框的类型 */
	.permissionManaTool {
		display: flex;
	}
		/* 将permissionManaTool所在元素中所有的id=el-input的元素设置css样式 */
	.permissionManaTool .el-input {
		width: 300px;
		margin-right: 5px;
	}


</style>
