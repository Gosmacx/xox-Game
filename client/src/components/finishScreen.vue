<template>
        <div class="w-full h-full absolute z-50 bg-black bg-opacity-70 flex flex-col items-center justify-center space-y-10" >
            <div class="text-bold text-8xl block fadeEffect" > 
                <span v-if="finished.username" > <strong> {{ finished.username }} </strong> Oyunu Kazandı </span>
                <span v-else > {{ finished }} </span>
            </div>
            <button @click="againPlay" class="h-20 w-96 hover:bg-purple-400 fadeEffect  active:scale-95 transition-all bg-purple-500 outline-none rounded-lg text-5xl p-1" >
                Tekrar Oyna
            </button>
        </div>
</template>

<script setup>

defineProps({
    finished: Object,
    againPlay: Function,
})

</script>