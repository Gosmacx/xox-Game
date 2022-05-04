<template>
    <!-- WAITING -->
    <div v-if="!room?.x || !room?.o" class="h-screen w-full flex flex-col space-y-20 items-center justify-center" >
        <span class="text-bold text-8xl text-purple-500" > {{ room?.id }} </span>
        <span class="text-bold text-8xl animate-pulse" >Oyuncu Bekleniyor...</span>
    </div>

    <!-- GAME -->
    <section v-else class="h-screen w-full flex flex-col items-center justify-center" >

        <!-- FINISH SCREEN -->
        <finish-screen v-if="finished" :againPlay="againPlay" :finished="finished" />
        
        <!-- PLAYER NAMES -->
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

        <!-- GAME TABLE  -->
        <div v-if="refresh" class="flex flex-wrap w-[336px] items-center justify-center shadow-lg" >      
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

        <!-- LOADING SCREEN -->
        <div v-else class="w-[336px] h-80 flex items-center justify-center" >
            <loading-circle/>
        </div>
    
        <!-- COUNTDOWN BAR -->
        <countdown-bar :countdown="countdown" />

        <!-- BIG USERNAME -->
        <span class="-z-10 absolute text-[200px] -bottom-12 whitespace-pre-wrap opacity-5 text-center max-w-max " > {{ player === 'O' ? room.o.username : room.x.username }} </span>

    </section>

</template>

<script setup>

import { ref } from 'vue'
import socket from '../socket'
import { useRoute } from 'vue-router'

import countdownBar from '../components/countdownBar.vue'
import finishScreen from '../components/finishScreen.vue'
import loadingCircle from '../components/loadingCircle.vue'

const route = useRoute()
const player = ref(null)
const refresh = ref(true)
const countdown = ref(328)
const finished = ref(null)
const room = ref(null)

socket.emit('get-room', route.query.room)

socket.on('room-data', (data) => {
    player.value = socket.id == data?.x?.id ? 'X' : 'O'
    room.value = data
})

socket.on('playerMoved', (data) => {
    document.getElementById('soundEffect').play()
    room.value = data.room
    const choose = document.createElement('span')
    choose.innerHTML = `<span class="select-none text-bold text-6xl text-white" > ${data.player.role} </span>`
    document.getElementById(`table${data.index}`).appendChild(choose)
})

socket.on('game-finished', (player) =>{
    finished.value = player ? player : 'Oyun berabere bitti.' 
})

socket.on('room-joined', (data) => {
    room.value = data
})

socket.on('player-disconnected', (data) => {
    console.log("HERİF ÇIKTI LAN BABA")
    room.value = data
})

socket.on('refresh-game', (data) => {

    refresh.value = false
    setTimeout(() => {
        refresh.value = true
    }, 1000);

    [1,2,3,4,5,6,7,8,9].forEach(table => {
        document.getElementById(`table${table}`).innerHTML = ''
    })

    finished.value = null
    room.value = data
})

// const countdownTimer =  setInterval(() => {
//     countdown.value = parseInt(countdown.value) - 10.93333333333333
//     if (countdown.value <= 0) clearInterval(countdownTimer)
// }, 1000);

const againPlay = () => {
    socket.emit('again-play', room.value)
}

const chooseIndex = (index) => {
    socket.emit('move', {
        roomID: room.value.id,
        index,
        id: socket.id
    })
}


</script>

<style>
.rightBorder {
    border-right: 5px solid white;
}

.horizontalBorder {
    border-bottom: 5px solid white;
    border-top: 5px solid white;
    width: 1,;
}

.turnPlayer {
    text-decoration-line: underline;
    text-decoration-color: #a855f7;
}

.fadeEffect {
    animation: myFade 500ms ease-in-out;
}

@keyframes myFade {
    from {
        opacity: 0;
        transform: scale(0.1);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

</style>