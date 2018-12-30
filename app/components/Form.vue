<template>
    <FlexboxLayout flexDirection="column">
        <ScrollView>
            <StackLayout class="form" orientation="vertical">
                <StackLayout>
                    <GridLayout rows="*" columns="auto, *">
                        <Label @tap="todoDelete(id)" :class="hideDelete?'hide':''" class="trash-icon fa" :text="'fa-trash' | fonticon" row="0" col="0"/>
                        <Label @tap="$modal.close(true)" text="Close" :class="hideClose?'hide':''" class="close-icon fa" :text="'fa-close' | fonticon" horizontalAlignment="right" row="0" col="1"/>
                    </GridLayout>
                </StackLayout>
                <StackLayout class="input-field">
                    <TextView ref="title" hint="Title" :editable="inputTitleEdit" maxLength="50" class="input" v-model="inputTitle" />
                </StackLayout>
                <StackLayout>
                    <GridLayout rows="*" columns="auto, auto" orientation="horizontal">
                        <Label text="Date" @tap="showDate" class="input-label date" :class="selectDate?'active-date':''" row="0" col="0"/>
                        <Label text="Time" @tap="showTime" class="input-label time" :class="selectTime?'active-time':''" row="0" col="1"/>
                    </GridLayout>
                </StackLayout>
                <StackLayout>
                    <DatePicker :class="selectDate?'':'hide'" class="input-date" v-model="inputDate" />
                    <TimePicker :class="selectTime?'':'hide'" class="input-time" v-model="inputTime" :time="inputTime" />
                </StackLayout>
                <StackLayout class="input-field">
                    <TextView hint="Description..." :editable="inputDescEdit" class="input" height="100" v-model="inputDesc" />
                </StackLayout>
                <StackLayout class="input-field">
                    <GridLayout rows="auto" columns="*, auto, auto">
                        <Button text="Todo" @tap="todoSave" :class="hideTodo?'hide':''" class="input-button todo" row="0" col="0" horizontalAlignment="center"/>
                        <Button text="Update" @tap="todoUpdate(id)" :class="hideUpdate?'hide':''" class="input-button update" row="0" col="0"/>
                        <Button text="Done" @tap="todoDone(id)" :class="hideDone?'hide':''" class="input-button done" row="0" :col="hideUpdate?'0':'1'"/>
                    </GridLayout>
                </StackLayout>
            </StackLayout>
        </ScrollView>
    </FlexboxLayout>
</template>
<script>
import EventBus from "./../common/event-bus.js"
import Sqlite from "./../common/sqlite.js"
import * as Toast from 'nativescript-toast'

export default {
    props:['id', 'inputs', 'status'],
    data() {
        return {
            hideClose: true,
            hideTodo: true,
            hideUpdate: true,
            hideDone: true,
            hideDelete: true,
            hideSched: true,
            inputTitle: '',
            inputDate: new Date,
            inputTime: new Date,
            inputDesc: '',
            inputTitleEdit: true,
            // inputDateEdit: true,
            // inputTimeEdit: true,
            inputHour:'',
            inputMin:'',
            inputDescEdit: true,
            selectDate: true,
            selectTime: false,
            dateArray: [],
            timeArray: [],
            dateTime: '',
            message: [],
            valid: true
        }
    },
    mounted() {
        
        this.$refs.title.nativeView.focus();
        EventBus.$on('hideClose', (val) => {
            this.hideClose = val 
        });
        EventBus.$on('hideTodo', (val) => {
            this.hideTodo = val 
        });
        EventBus.$on('hideSched', (val) => {
            this.hideSched = val 
        });
        EventBus.$on('hideUpdate', (val) => {
            this.hideUpdate = val 
        });
        EventBus.$on('hideDone', (val) => {
            this.hideDone = val 
        });
        EventBus.$on('hideDelete', (val) => {
            this.hideDelete = val 
        });
        EventBus.$on('fillInputs', () => {
            this.fillInputs()
        });
        this.disableInputs()
    },
    methods: {
        todoSave() {
            if(this.validInput()){
                let resp = Sqlite.todo([this.inputTitle, this.datetimeFormat(), this.inputDesc, 'todo'])
                if(!resp) {
                    Toast.makeText("Todo failed").show()
                } else {
                    Toast.makeText("Todo: " + this.inputTitle).show() 
                    EventBus.$emit('loadList', this.status);
                }
            }
        },
        todoUpdate(id) {
            if(this.validInput()){
                let resp = Sqlite.update([this.inputTitle, this.datetimeFormat(), this.inputDesc, id])
                if(!resp) {
                    Toast.makeText("Update failed").show()
                } else {
                    Toast.makeText("Updated: "+ this.inputTitle).show()
                    EventBus.$emit('loadList', this.status);
                }
            }
        },
        todoDone(id) {
            confirm('Are you sure?').then(result => {
                if(result){
                    let resp = Sqlite.done(['done', id])
                    if(!resp) {
                        Toast.makeText("Done failed").show()
                    } else {
                        Toast.makeText("Done: "+ this.inputTitle).show()
                        EventBus.$emit('loadList', this.status);
                    }
                }
            });
        },
        todoDelete(id) {
            confirm('Are you sure?').then(result => {
                if(result){
                    let resp = Sqlite.delete([id])
                    if(!resp) {
                        Toast.makeText("Delete failed").show()
                    } else {
                        Toast.makeText("Deleted: "+ this.inputTitle).show()
                        EventBus.$emit('loadList', this.status);
                    }
                }
            });
        },
        validInput() {
            this.message = []
            this.valid = true
            if(this.inputTitle === '' || this.inputDate === '' || 
                this.inputTime === '' || this.inputDesc === '' ||
                 this.inputDate === null || this.inputTime === null){
                this.message.push('Please complete the fields.')
                this.valid = false
            }
            if(this.inputTitle != '' && this.inputTitle.length <= 5){
                this.message.push('Title requires min of five characters.')
                this.valid = false
            }
            if(this.inputDesc != '' && this.inputDesc.length <= 5){
                this.message.push('Description requires min of five characters.')
                this.valid = false
            }
            if(!this.valid) {
                for(var val of this.message){
                    Toast.makeText(val).show()
                }
            }
            return this.valid
        },
        fillInputs(){
            for(var i in this.inputs) {
                this.inputTitle = this.inputs[i].title
                this.inputDate = this.inputs[i].datetime
                this.inputTime = this.inputs[i].datetime
                this.inputDesc = this.inputs[i].desc
            }
        },
        datetimeFormat(){
            this.dateArray = []
            this.timeArray = []
            this.timeArray = this.inputTime.toString().split(' ')
            this.dateArray = this.inputDate.toString().split(' ')
            this.dateTime = this.dateArray[0]+' '+this.dateArray[3]+'-'+this.dateArray[1]+'-'+this.dateArray[2]+' '+this.timeArray[4]
            return new Date(this.dateTime +' GMT+0800')
        },
        disableInputs(){
            if(this.status === 'done' || this.status === 'alert') {
                this.inputTitleEdit = false
                // this.inputDateEdit = false
                // this.inputTimeEdit = false
                this.inputDescEdit = false
            }
        },
        showDate(){
            this.selectDate = true
            this.selectTime = false
        },
        showTime(){
            this.selectDate = false
            this.selectTime = true
        }
    }
};
</script>
<style scoped>
.form {
    margin-left: 30;
    margin-right: 30;
    flex-grow: 2;
    vertical-align: top;
}
.close-icon {
    margin:10 0;
    font-size:25;
    color:#b3b3b3;
}
.trash-icon {
    margin:10 0;
    font-size:25;
    color:#f6c2d8;
}
.hide {
    visibility: collapsed;
}
.input-field {
    width:100%;
}
.input-date, 
.input-time {
    margin:0;
}
.input-button {
    width:50%;
    color:#fff;
}
.input-label {
    height:40;
    width:50%;
    font-size:20;
}
.input-label.date,
.input-label.time {
    border-bottom-color:#7babed;
    background-color:#fff;
    text-align:center;
}
.active-date,
.active-time {
    color:#7babed;
    font-weight:bold;
    border-bottom-width:3;
}
.input-button.todo {
    background-color:#edbd7b;
}
.input-button.sched {
    background-color:#efefef;
}
.input-button.update { 
    background-color:#7babed;
}
.input-button.done { 
    background-color:#847bed;
}
</style>