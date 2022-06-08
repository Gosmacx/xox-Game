<template>
    <!-- WAITING -->
    <div v-if="!room?.x || !room?.o" class="h-screen w-full flex flex-col space-y-20 items-center justify-center" >
        <span class="text-bold text-8xl text-purple-500" > {{ room?.id }} </span>
        <span class="text-bold md:text-8xl text-5xl text-center animate-pulse" >Oyuncu Bekleniyor...</span>
    </div>

    <!-- GAME -->
    <section v-else class="h-screen w-full flex flex-col items-center justify-center" >

        <!-- FINISH SCREEN -->
        <finish-screen v-if="finished" :againPlay="againPlay" :finished="finished" />
        
        <!-- PLAYER NAMES -->
        <player-names :room="room" />

        <!-- GAME TABLE  -->
         <game-table v-if="refresh" :room="room" :player="player" :chooseIndex="chooseIndex" />

        <!-- REFRESH LOADING SCREEN -->
        <div v-else class="w-[336px] h-[336px] flex items-center justify-center" >
            <loading-circle/>
        </div>
    
        <!-- COUNTDOWN BAR -->
        <countdown-bar :countdown="countdown" />

        <!-- BIG USERNAME -->
        <span class="-z-10 absolute md:text-[150px] text-7xl bottom-10 whitespace-pre-wrap opacity-5 text-center max-w-max " > 
            {{ player === 'O' ? room.o.username : room.x.username }} 
        </span>

    </section>

</template>

<script setup>

import { ref } from 'vue'
import socket from '../socket'
import { useRoute, useRouter } from 'vue-router'

import countdownBar from '../components/countdownBar.vue'
import finishScreen from '../components/finishScreen.vue'
import loadingCircle from '../components/loadingCircle.vue'
import gameTable from '../components/gameTable.vue'
import playerNames from '../components/playerNames.vue'

const route = useRoute()
const router = useRouter()
const player = ref(null)
const refresh = ref(true)
const countdown = ref(328)
const finished = ref(null)
const room = ref(null)

socket.emit('get-room', route.query.room)

socket.on('room-data', (data) => {
    
    if (data.o?.id !== socket.id && data.x?.id !== socket.id) return router.push("/");

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
    
    for (let index = 10; index < 10; index++) {
        document.getElementById(`table${table}`).innerHTML = ''        
    }
    
    setTimeout(() => {
        refresh.value = true
    }, 1000);

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