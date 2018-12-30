<template>
        <ListView for="list in tasks" :key="$index">
            <v-template>
                <Scrollview>
                    <StackLayout class="list" orientation="horizontal">
                        <GridLayout rows="auto, auto" columns="*, auto" class="list-row">
                            <GridLayout rows="auto, *, *" columns="*" row="0" col="0" @tap="showModal(list.id, list.status)">
                                <GridLayout col="0" row="0" columns="*, auto" rows="auto">
                                    <StackLayout col="0" row="0" orientation="horizontal" horizontalAlignment="left">
                                        <Label :text="list.title" textWrap="true" class="list-title"/>
                                    </StackLayout>
                                    <!-- StackLayout col="1" row="0" orientation="horizontal" horizontalAlignment="right" -->
                                        <GridLayout col="1" row="0" columns="*" rows="auto, auto" horizontalAlignment="right">
                                            <StackLayout col="0" row="0" orientation="horizontal">
                                                <Label :text="formatDate(list.datetime)" class="list-date" />
                                            </StackLayout>
                                            <StackLayout col="0" row="1" orientation="horizontal" horizontalAlignment="right">
                                                <Label :text="formatTime(list.datetime)" class="list-time" />
                                            </StackLayout>
                                        </GridLayout>
                                    <!-- /StackLayout -->
                                </GridLayout>
                                <StackLayout col="0" row="1" orientation="horizontal" horizontalAlignment="left">
                                    <Label :text="list.desc" textWrap="true" class="list-desc"/>
                                </StackLayout>
                            </GridLayout>
                            <StackLayout col="1" row="0" orientation="horizontal" horizontalAlignment="right" @tap="setAlert(list.id, list.title, list.desc, list.status, list.datetime)"  :class="hideAlarm?'hide':''">
                                <Label :class="list.status === 'alert'?'alert-active-icon':'alert-icon'" class="fa" :text="'fa-bell' | fonticon"  />
                            </StackLayout>
                        </GridLayout>
                    </StackLayout>
                </Scrollview>
            </v-template>
        </ListView>
</template>
<script>
import Form from "./Form"
import EventBus from "./../common/event-bus.js"
import Sqlite from "./../common/sqlite.js"
import Notif from "./../common/notification.js"
import * as Toast from 'nativescript-toast'

export default {
    props:["tasks", "item"],
    data() {
        return {
            hideAlarm: false,
            textTime: '',
            textDate: ''
        }
    },
    mounted(){
        EventBus.$on('hideAlarm', (val)=>{
            this.hideAlarm = val
        });
    },
    methods: {
        showModal(id, status) {
            this.$showModal(Form, { props: { id: id, inputs: this.getfieldInput(id), status: status }});
            if(status === 'todo') {
                EventBus.$emit('hideClose', false);
                EventBus.$emit('hideDelete', false);
                EventBus.$emit('hideTodo', true);
                EventBus.$emit('hideDone', false);
                EventBus.$emit('hideUpdate', false);
                EventBus.$emit('hideSched', true);
                EventBus.$emit('fillInputs');
            }
            if(status === 'done') {
                EventBus.$emit('hideClose', false);
                EventBus.$emit('hideDelete', false);
                EventBus.$emit('hideTodo', true);
                EventBus.$emit('hideDone', true);
                EventBus.$emit('hideUpdate', true);
                EventBus.$emit('hideSched', true);
                EventBus.$emit('fillInputs');
            }
            if(status === 'alert') {
                EventBus.$emit('hideClose', false);
                EventBus.$emit('hideDelete', true);
                EventBus.$emit('hideTodo', true);
                EventBus.$emit('hideDone', false);
                EventBus.$emit('hideUpdate', true);
                EventBus.$emit('hideSched', true);
                EventBus.$emit('fillInputs');
            }
        },
        getfieldInput(id){
            let resp = Sqlite.findRecord(id)
            return resp
        },
        setAlert(id, title, body, status, datetime){
            if(status != 'alert') {
                if(new Date(datetime).getTime() > new Date().getTime()) {
                    confirm('Set Alert?').then(result => {
                        if(result){
                            let resp = Sqlite.sched(['alert', id])
                            if(!resp) {
                                Toast.makeText("Alert set failed").show()
                            } else {
                                
                                Toast.makeText("Alert set: "+ title).show()
                                Notif.setNotif(id, title, body, '', datetime);
                                EventBus.$emit('loadList', status);
                            }
                        }
                    });
                } else { Toast.makeText("Set time is less than the current time.").show() }
            } else {
                confirm('Unset Alert?').then(result => {
                    if(result){
                        let resp = Sqlite.sched(['todo', id])
                        if(!resp) {
                            Toast.makeText("Alert unset failed").show()
                        } else {
                            Toast.makeText("Alert unset: "+ title).show()
                            Notif.unsetNotif(id);
                            EventBus.$emit('loadList', status);
                        }
                    }
                });
            }
            
        },
        formatDate(date){
            if(date != '' || date != undefined || date != null) {
                this.dateArray = []
                this.dateArray = date.split(' ')
                this.textDate = this.dateArray[0]+' '+this.dateArray[3]+'/'+this.dateArray[1]+'/'+this.dateArray[2]
            }
            return this.textDate
        },
        formatTime(time) {
            if(time != '' || time != undefined || time != null) {
                this.timeArray = []
                this.timeArray = time.split(' ')
                let H = this.timeArray[4].substr(0, 2)
                let firstColon = this.timeArray[4].indexOf(':')
                let h = H % 12 || 12
                let ampm = ''
                ampm = H > 12 ? ' PM' : ' AM'
                this.textTime = h + this.timeArray[4].substr(firstColon, 3) + ampm
            }
            return this.textTime
        }
    }
};
</script>
<style scoped>
.list {
    margin:0 10 0 10;
}
.list-row {
    margin:10 0;
}
.list-title {
    color:#6f6e6e;
    font-weight:bold;
}
.list-desc {
    color:#b3b3b3;
}
.list-date, .list-time {
    color:#ccc;
}
.alert-icon {
    font-size:25;
    color:#ccc;
    margin-left: 10;
    vertical-align: center;
}
.alert-active-icon {
    color:#abed7b;
    font-size:25;
    margin-left: 10;
    vertical-align: center;
}
.hide {
    visibility:collapsed;
}
</style>