<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" >添加</el-button>
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <div style="float: right;">
                    <el-select v-model="select_cate" placeholder="筛选类型" class="handle-select mr10">
                        <el-option v-for="item in editableTabs" :key="item.id" :label="item.title" :value='item.title'></el-option>
                    </el-select>
                    <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange"
                :height="tableHeight">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名" width="200"></el-table-column>
                <el-table-column label="操作" min-width="220">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :page-size="pagination.pageSize" layout="prev, pager, next, jumper, sizes, total" :total="pagination.totalCount">
                </el-pagination>
            </div>
        </div>
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
            editableTabs: [],
            tableData: [],
            tableHeight: window.innerHeight - 350,
            pagination: {
                page: 1,
                pageSize: 100,
                totalCount: 1000
            },
            multipleSelection: [],
            select_cate: '',
            select_word: '',
            del_list: [],
            is_search: false,
            delVisible: false,
            form: {
                title: '',
                date: '',
                address: ''
            },
            row: '',
            idx: -1
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
        loadPage () {
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
                    console.log(res.rs);
                    _this.tableData = res.rs;
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
        search () {
            this.is_search = true;
        },
        handleDelete (index, row) {
            this.idx = index;
            this.row = row;
            this.delVisible = true;
        },
        delAll () {
            const length = this.multipleSelection.length;
            let str = '';
            for (let i = 0; i < length; i++) {
                let v = this.multipleSelection[i];
                this.del_list.push(v.roleId);
                str += v.roleId + ',';
            }
            console.log(str);
        },
        handleSelectionChange (val) {
            this.multipleSelection = val;
        },
        // 确定删除
        deleteRow () {
            console.log(this.row.roleId);
            this.del_list.push(this.row.roleId);
            this.delVisible = false;
            this.$message({
                message: '删除成功',
                type: 'success'
            });
        }
    }
}
</script>

<style scoped>
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
