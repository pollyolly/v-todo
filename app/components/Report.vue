<template>
    <StackLayout>
        <StackLayout horizontalAlignment="center">
            <Label :text="todocount" class="todo-count" />
        </StackLayout>
        <StackLayout horizontalAlignment="center">
            <Label text="Todo" class="todo-desc" />
        </StackLayout>
        <StackLayout horizontalAlignment="center">
            <Label :text="misscount" class="miss-count" />
        </StackLayout>
        <StackLayout horizontalAlignment="center">
            <Label text="Missed" class="miss-desc" />
        </StackLayout>
        <StackLayout horizontalAlignment="center">
            <Label :text="donecount" class="done-count" />
        </StackLayout>
        <StackLayout horizontalAlignment="center">
            <Label text="Done" class="done-desc" />
        </StackLayout>    
    </StackLayout>
</template>
<script>
import Sqlite from "./../common/sqlite.js"
import * as Toast from 'nativescript-toast'
import EventBus from "./../common/event-bus.js"

export default {
    data(){
        return {
            todocount: 0,
            misscount: 0,
            donecount: 0
        }
    },
    mounted(){
        this.todoReport()
        this.missReport()
        this.doneReport()
        EventBus.$on('listReport', ()=>{
            this.todoReport()
            this.missReport()
            this.doneReport()
        });
    },
    methods: {
        todoReport(){
            let resp = Sqlite.totalTodo();
            if(!resp){
                this.todocount = 0
            } else {
                this.todocount = resp
            }
        },
        missReport(){
             let resp = Sqlite.totalMiss([new Date()]);
            if(!resp){
                this.misscount = 0
            } else {
                this.misscount = resp
            }
        },
        doneReport(){
            let resp = Sqlite.totalDone();
            if(!resp){
                this.donecount = 0
            } else {
                this.donecount = resp
            }
        }
    }
}
</script>
<style scoped>
.todo-count, .miss-count, .done-count {
    font-size:60;
    font-weight:900;
}
.todo-desc, .miss-desc, .done-desc {
    font-size:40;
    font-weight:bold;
}
</style>