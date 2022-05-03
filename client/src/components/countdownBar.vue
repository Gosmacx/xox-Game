<template>
        <div class="w-[336px] p-1 relative h-4 bg-gray-200 mt-20 rounded-xl" >
            <div :style="{ width: `${countdown}px`  }" class="h-full transition-all bg-purple-500 rounded-xl" ></div>
        </div>
</template>

<script setup>

defineProps({
    countdown: String
})

</script>