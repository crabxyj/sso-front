<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 文章管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-select v-model="select_cate" placeholder="筛选类型" class="handle-select mr10">
                    <el-option v-for="item in editableTabs" :key="item.id" :label="item.title" :value='item.title'></el-option>
                </el-select>
                <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="data" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" :height="tableHeight">
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column prop="title" label="标题" width="200"></el-table-column>
                <el-table-column prop="username" label="作者" width="120"></el-table-column>
                <el-table-column prop="labelname" label="分类" width="120"></el-table-column>
                <el-table-column prop="status" label="状态" width="120" :formatter="status"></el-table-column>
                <el-table-column prop="date" label="日期" sortable width="150" :formatter="formatter"></el-table-column>
                <!-- <el-table-column prop="address" label="地址" :formatter="formatter"></el-table-column> -->

                <el-table-column label="操作" min-width="220" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button type="text" icon="el-icon-s-promotion" @click="handlePublish(scope.$index, scope.row)">发布</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :page-size="cur_pagesize" layout="prev, pager, next, jumper, sizes, total" :total="total">
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
            editableTabs: [{
                title: '娱乐',
                id: '1'
            }, {
                title: '军事',
                id: '2'
            }, {
                title: '体育',
                id: '3'
            }, {
                title: '财经',
                id: '4'
            }],
            tableData: [],
            tableHeight: window.innerHeight - 350,
            cur_page: 1,
            cur_pagesize: 100,
            total: 1000,

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
        this.getData();
        let _this = this;
        window.onresize = function () {
            _this.tableHeight = window.innerHeight - 350;
        }
    },
    computed: {
        data () {
            return this.tableData.filter((d) => {
                let isDel = false;
                for (let i = 0; i < this.del_list.length; i++) {
                    if (d.title === this.del_list[i].title) {
                        isDel = true;
                        break;
                    }
                }
                if (!isDel) {
                    if (d.labelname.indexOf(this.select_cate) > -1 &&
                        (d.title.indexOf(this.select_word) > -1 ||
                            d.labelname.indexOf(this.select_word) > -1)
                    ) {
                        return d;
                    }
                }
            })
        }
    },
    methods: {
        // 分页导航
        handleCurrentChange (val) {
            this.cur_page = val;
            this.getData();
        },
        // 分页 更新分页大小
        handleSizeChange (val) {
            this.cur_pagesize = val;
            this.getData();
        },
        getData () {
            var postData = {
                page: this.cur_page,
                pageSize: this.cur_pagesize
            }
            console.log(postData);
        },
        search () {
            this.is_search = true;
        },
        formatter (row, column) {
            var date = new Date(row.time);
            return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        },
        status (row, column) {
            var value = row.status;
            if (value === 0) {
                return '待审';
            } else if (value === 1) {
                return '未通过';
            } else if (value === 2) {
                return '已发布';
            } else if (value === 3) {
                return '已删除'
            }
        },
        filterTag (value, row) {
            return row.tag === value;
        },
        handleEdit (index, row) {
            this.$router.push({
                path: '/background/markdown',
                query: {
                    articleId: row.articleId
                }
            });
        },
        handleDelete (index, row) {
            this.idx = index;
            this.row = row;
            this.delVisible = true;
        },
        handlePublish (index, row) {
            console.log(row);
        },
        delAll () {
            const length = this.multipleSelection.length;
            let str = '';
            this.del_list = this.del_list.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].articleId + ',';
            }
            console.log(str);
        },
        handleSelectionChange (val) {
            this.multipleSelection = val;
        },
        // 确定删除
        deleteRow () {
            console.log(this.row.articleId);
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
