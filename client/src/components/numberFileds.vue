<template>
    <div class="flex items-center relative justify-center" >

        <div class="w-80 h-20 flex items-center justify-between" >

            <input 
                id="field1" 
                @input="protectNumber"
                @keyup="next(1)" 
                @keyup.delete="next(0)" 
                autofocus type="tel"
                class=" text-black text-7xl text-center flex items-center justify-center w-24 h-20 outline-none rounded-lg"
            >

            <input 
                id="field2" 
                @input="protectNumber"
                @keyup="next(2)" 
                @keyup.delete="next(0)" 
                type="tel"
                class=" text-black text-7xl text-center flex items-center justify-center w-24 h-20 outline-none rounded-lg"
            >

            <input 
                id="field3" 
                @input="protectNumber"
                @keyup.delete="next(1)" 
                type="tel"
                class=" text-black text-7xl text-center flex items-center justify-center w-24 h-20 outline-none rounded-lg mr-3"
            >

        </div>

        <button @click="collectNumbers" class="h-20 w-16 bg-purple-500 transition-all hover:bg-purple-400 rounded-lg" >
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto" height="48" width="48" fill="#fff"><path d="M18.9 35.7 7.7 24.5 9.85 22.35 18.9 31.4 38.1 12.2 40.25 14.35Z"/></svg>
        </button>
    </div>
</template>

<script setup>

const props = defineProps({
    joinRoom: Function
})


const protectNumber = (e) => {
    const value = e.target.value
    if(value.length === 2) {
        e.target.value = value.slice(0,1)
    }
}

const next = (index) => {
    document.getElementById(`field${index+1}`).focus()
}

const collectNumbers = () => {
    const numbers = [
        document.getElementById('field1').value,
        document.getElementById('field2').value,
        document.getElementById('field3').value
    ]

    props.joinRoom(numbers.join(''))
}

</script>