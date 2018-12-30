<template>
    <GridLayout height="50" width="100%" row="1" rows="auto"
        columns="auto,auto,auto" verticalAlignment="bottom">
        <GridLayout  :class="selectedTab==0?'tabview-active':''" @tap="todoTab" rows="auto"
            cols="auto" class="nav tabview" col="0" row="0" width="33.33%">
            <Label row="0" text="Todo" :class="selectedTab==0?'tabview-text-active':''" class="tabview-text"></Label>
        </GridLayout>
        <GridLayout  :class="selectedTab==1?'tabview-active':''" @tap="doneTab" rows="auto"
            cols="auto" class="nav tabview done-tab" col="1" row="0" width="33.33%">
            <Label row="0" text="Done" :class="selectedTab==1?'tabview-text-active':''" class="tabview-text"></Label>
        </GridLayout>
        <GridLayout :class="selectedTab==2?'tabview-active':''" @tap="addTab" rows="auto"
            cols="auto" class="nav tabview" col="2" row="0" width="33.33%">
            <Label row="0" text="Add" :class="selectedTab==2?'tabview-text-active':''" class="tabview-text"></Label>
        </GridLayout>
    </GridLayout>
</template>
<script>
import EventBus from "./../common/event-bus.js"

export default {
    data() {
        return {
            selectedTab: 0
        }
    },
    methods: {
        todoTab() {
            this.selectedTab=0;
            this.$emit('loadTodo');
            EventBus.$emit('hideAlarm', false);
        },
        doneTab() {
            this.selectedTab=1;
            this.$emit('loadDone');
            EventBus.$emit('hideAlarm', true);
        },
        addTab() {
            this.selectedTab=2;
            this.$emit('hideForm');
            EventBus.$emit('hideClose', true);
            EventBus.$emit('hideTodo', false);
            EventBus.$emit('hideSched', false);
            EventBus.$emit('hideDone', true);
            EventBus.$emit('hideUpdate', true);
            EventBus.$emit('hideDelete', true);
            EventBus.$emit('hideReport', true);
        }
    }
};
</script>
<style scoped>
.tabview {
	border-top-color: #efefef;
	border-top-width: 3;
	margin: 0;
	height: 50;
}
.tabview-active {
    border-top-color: #7babed;
}
.tabview-text {
	color: #6f6e6e;
	margin-top: 10;
	margin-bottom: 5;
	font-size: 20;
	horizontal-align: center;
}
.tabview-text-active {
	margin-top: 0;
	margin-bottom: 5;
    font-size: 20;
	font-weight: bold;
	color: #7babed;
	vertical-align: center;
}
.done-tab {
    border-right-width:1;
    border-left-width:1;
    border-right-color:#efefef;
    border-left-color:#efefef;
}
</style>