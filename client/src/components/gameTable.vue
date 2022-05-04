<template>
    <div class="flex flex-wrap w-[336px] items-center justify-center shadow-lg" >      
        <div 
            v-for="table in [1,2,3,4,5,6,7,8,9]" 
            @click="chooseIndex(table)"
            :key="table" 
            :id="`table${table}`"
            class="group flex items-center justify-center w-28 h-28 cursor-pointer transition-all" 
            :class="{ 
                rightBorder: [1,4,7,2,5,8].includes(table), 
                horizontalBorder: [4,5,6].includes(table),
            }" 
        >
            <span v-if="!room.moves?.find(x => x.index == table)" class="invisible select-none group-hover:visible opacity-50 text-bold text-6xl text-white" > 
                {{ player }} 
            </span>
        </div>
    </div>
</template>

<script setup>

defineProps({
    chooseIndex: Function,
    room: Object,
    player: String,

})

</script>