<template>
    <div class="counter">
        <span>{{timeCounter<10&&timeCounter>0?"0"+timeCounter:timeCounter}}</span>{{tips}}
    </div>
</template>

<script>
    export default {
        name: "countDown",
        props:['seconds','name','tips'],
        data() {
            return {
                timeCounter:0
            }
        },
        methods: {
            timeCount(){
                //
                let startTime=localStorage.getItem(`_${this.name}_`);
                let nowTime= new Date().getTime();
                if(startTime){
                    let counter=this.seconds-parseInt((nowTime-startTime)/1000 ,10);
                    this.timeCounter=counter<0?0:counter;
                }else{
                    this.timeCounter=this.seconds;
                    localStorage.setItem(`_${this.name}_`,nowTime);
                }
                 let timer=setInterval(()=>{
                    if(this.timeCounter>0&&this.timeCounter<=this.seconds){
                        this.timeCounter--;
                    }else{
                        localStorage.removeItem(`_${this.name}_`)
                        clearInterval(timer);
                        this.onTimeout();
                    }
                },1000)
            },
            onTimeout(){
                this.$emit("onTimeout");
            },
               },
        computed: {},
        watch: {},
        created: function () {
        },
        mounted: function () {
            this.timeCount();
            },
        updated: function () {

        }
    }
</script>

<style scoped>

</style>