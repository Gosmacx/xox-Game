<template>
    <div class="flex items-center justify-center space-x-6 border-2 border-white py-3 px-2 rounded-lg mb-20" >   
        <div class="items-center justify-center flex flex-col" >
            <span class="text-7xl absolute opacity-5" >X</span>
            <span :class="{turnPlayer: room.turn == room.x.id }" class="font-bold text-3xl z-10" > {{ room.x.username }} </span>
        </div>
        <span class="text-purple-500 font-bold text-5xl" >VS</span>
        <div class="items-center justify-center flex flex-col" >
            <span class="text-7xl absolute opacity-5 text-center" >O</span>
            <span :class="{turnPlayer: room.turn == room.o.id }" class="font-bold text-3xl z-10" > {{ room.o.username }} </span>
        </div>
    </div>
</template>

<script setup>

defineProps({
    room: Object,
})


</script>