<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-refresh" @click="loadPage()"></el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addRoleShow()">添加</el-button>
                <div style="float: right;">
                    <el-select v-model="select_cate" placeholder="筛选类型" class="handle-select mr10">
                        <el-option v-for="item in editableTabs" :key="item.id" :label="item.title" :value='item.title'></el-option>
                    </el-select>
                    <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
            </div>
            <el-table v-loading="loading" :data="tableData" class="table"  border highlight-current-row>
                <el-table-column label="场景名称" prop="name"></el-table-column>
                <template>
                    <el-table-column :label="item.label" v-for="item in tablehead" :key="item.id">
                        <template slot="header" slot-scope="scope">
                            <el-checkbox v-model="tableheadCheck[scope.column.property]" @change="modify(null,scope.column.property)"></el-checkbox>
                            <span v-text="label"></span>
                        </template>
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row[scope.column.property]" @change="modify(scope.row,scope.column.property)"></el-checkbox>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :page-size="pagination.pageSize" layout="prev, pager, next, jumper, sizes, total" :total="pagination.totalCount">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="添加角色" :visible.sync="addVisible" width="400px" center>
            <el-form :model="form">
                <el-form-item label="角色名" label-width="60px">
                    <el-input type="text" autocomplete="off" placeholder="请输入角色名" v-model="form.roleName"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data () {
        return {
            loading: false,
            tablehead: [],
            tableheadCheck: {},
            tableData: [],
            editableTabs: [],
            tableHeight: window.innerHeight - 350,
            pagination: {
                page: 1,
                pageSize: 10,
                totalCount: 0
            },
            select_cate: '',
            select_word: '',
            del_list: [],
            is_search: false,
            delVisible: false,
            addVisible: false,
            form: {
                roleName: ''
            },
            row: ''
        }
    },
    mounted () {
        this.loadPage();
        let _this = this;
        window.onresize = function () {
            _this.tableHeight = window.innerHeight - 350;
        }
    },
    computed: {
        data () {
            return this.tableData.filter(d => this.del_list.indexOf(d.roleId) === -1)
        }
    },
    methods: {
        loadTableHeader () {
            var data = {
                page: this.pagination.page,
                pageSize: this.pagination.pageSize
            };
            let _this = this;
            this.$myhttp.myGet(
                'sso', 'roleLoad', data, res => {
                    if (res.code !== 0) {
                        _this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                    _this.pagination.totalCount = res.r.totalCount;
                    _this.tableData = res.r.rs;
                });
        },
        loadPage () {
            let _this = this;
            this.$myhttp.myGet(
                'sso', 'portUrls', {}, res => {
                    if (res.code !== 0) {
                        _this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                    console.log(res);
                });
        },
        // 分页导航
        handleCurrentChange (val) {
            this.pagination.page = val;
            this.loadPage();
        },
        // 分页 更新分页大小
        handleSizeChange (val) {
            this.pagination.pageSize = val;
            this.loadPage();
        },
        addRoleShow () {
            this.form.roleName = null;
            this.addVisible = true;
        },
        addRole () {
            var data = {
                roleName: this.form.roleName
            };
            let _this = this;
            this.$myhttp.myPost(
                'sso', 'roleAdd', data, res => {
                    if (res.code !== 0) {
                        _this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                    _this.tableData.push(res.r);
                    _this.addVisible = false;
                    _this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                });
        },
        search () {
            this.is_search = true;
        },
        handleDelete (index, row) {
            this.row = row;
            this.delVisible = true;
        },
        // 确定删除
        deleteRow () {
            var data = {
                roleId: this.row.roleId
            };
            let _this = this;
            this.$myhttp.myPost(
                'sso', 'roleDelete', data, res => {
                    if (res.code !== 0) {
                        _this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                        return;
                    }
                    _this.del_list.push(data.roleId);
                    _this.delVisible = false;
                    _this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                });
        }
    }
}
</script>

<style>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }
</style>
