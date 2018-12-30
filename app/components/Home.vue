<template>
    <Page class="page">
        <ActionBar class="action-bar">
            <GridLayout rows="*" cols="auto, auto" orientation="horizontal">
                <StackLayout row="0" col="0" horizontalAlignment="left">
                    <SearchBar hint="Search here..." class="action-bar-search" v-model="search" />
                </StackLayout>
                <StackLayout row="0" col="1" @tap="listReport" horizontalAlignment="right" verticalAlignment="middle">
                    <Label class="list-icon fa">{{'fa-list' | fonticon}}</Label>
                </StackLayout>
            </GridLayout>
        </ActionBar>
        <GridLayout rows="*, auto" columns="auto">
            <GridLayout row="0" column="auto" width="100%">
                <listComponent  :class="hideList?'hide':''" :tasks="filterSearch"></listComponent>
                <formComponent  :class="hideForm?'hide':''" />
                <reportComponent :class="hideReport?'hide':''" />
            </GridLayout>
            <menuComponent row="1" @loadDone="listDone" @loadTodo="listTodo" @hideForm="hideForm = false" />
        </GridLayout>
    </Page>
</template>

<script>
import Menu from "./Menu"
import List from "./List"
import Form from "./Form"
import Report from "./Report"
import Sqlite from "./../common/sqlite.js"
import EventBus from "./../common/event-bus.js"

export default {
    components: {
        'menuComponent': Menu,
        'listComponent': List,
        'formComponent': Form,
        'reportComponent': Report
    },
    data() {
        return  {
            tasks:[],
            hideForm: true,
            hideReport: true,
            hideList: true,
            search: ''
        }
    },
    mounted(){
        EventBus.$on('loadList', (status) => {
            if(status === 'todo'){
                this.listTodo()
            }
            if(status === 'done'){
                this.listDone()
            }
            if(status === 'alert'){
                this.listTodo()
            }
        });
        EventBus.$on('hideReport', (status)=>{
            this.hideReport = status
            this.hideList = status
        });
    },
    created() {
        this.listTodo()
        this.initDatabase()
    },
    computed: {
        filterSearch() {
            return this.tasks.filter((items) => {
                return items.title.match(this.search)
            })
        }
    },
    methods: {
        listTodo() {
            this.hideForm = true
            this.hideList = false
            this.hideReport = true
            this.tasks = []
            this.tasks = Sqlite.listTodo()
        },
        listDone() {
            this.hideForm = true
            this.hideList = false
            this.hideReport = true
            this.tasks = []
            this.tasks = Sqlite.listDone()
        },
        initDatabase() {
            Sqlite.copyDb()
            Sqlite.init()
            Sqlite.alterTable()
        },
        listReport() {
            this.hideForm = true
            this.hideList = true
            this.hideReport = false
            EventBus.$emit('listReport');
        }
    }
};
</script>

<style scope>
.info { font-size: 20; }
.action-bar { background-color: #7babed; }
.action-bar-search { color: #fff; font-size: 20; width:85%; }
.list-icon { font-size:30; margin:0 20; }
.hide { visibility:collapsed; }
</style>
