<template>
    <section class="h-[100vh] w-full  flex items-center justify-center" >

        <span class="-z-10 absolute text-[200px] bottom-24 whitespace-pre-wrap opacity-5 text-center max-w-max " > {{ username }} </span>

        <!-- STEP 1 TYPE USERNAME -->
        <div v-if="!nextStep" class="flex items-center relative justify-center shadow-lg shadow-black" >
            <input @keyup.enter="username ? nextStep = true : nextStep = false" v-model="username" maxlength="16" class="h-20 w-80 outline-none text-4xl text-center rounded-tl-lg rounded-bl-lg text-black" type="text" placeholder="Username">
            <button @click="username ? nextStep = true : nextStep = false" class="h-20 w-16 bg-purple-500 transition-all hover:bg-purple-400 rounded-tr-lg rounded-br-lg" >
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto" height="48" width="48" fill="#fff"><path d="M18.9 35.7 7.7 24.5 9.85 22.35 18.9 31.4 38.1 12.2 40.25 14.35Z"/></svg>
            </button>
        </div>
        
        <!-- STEP 2 CREATE GAME OR JOİN GAME -->
        <div v-if="!loading && nextStep" >

            <div  v-if="!create" class="flex items-center relative justify-center" >
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
                <button @click="joinRoom" class="h-20 w-16 bg-purple-500 transition-all hover:bg-purple-400 rounded-lg" >
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto" height="48" width="48" fill="#fff"><path d="M18.9 35.7 7.7 24.5 9.85 22.35 18.9 31.4 38.1 12.2 40.25 14.35Z"/></svg>
                </button>
            </div>
            
            <button @click="createGame" v-else class="h-20 w-96 hover:bg-purple-400 active:scale-95 transition-all bg-purple-500 outline-none rounded-lg text-5xl p-1" >
                Oyun Oluştur
            </button>
            
            <a
                href="#"
                @click="create = !create"
                class="block hover:underline" >
             {{ create ? 'Mevcut bir oyuna girmek için tıkla' : 'Oyun oluşturmak için tıkla'}} 
            </a>

        </div>

        <div v-if="loading" >
            <loading-circle />
        </div>

    </section>
</template>

<script setup>

import { onMounted, ref } from 'vue'
import socket from '../socket'
import { useRouter } from 'vue-router'

import loadingCircle from '../components/loadingCircle.vue'

const router = useRouter()
const username = ref(null)
const create = ref(false)
const nextStep = ref(false)
const loading = ref(false)

const next = (index) => {
    document.getElementById(`field${index+1}`).focus()
}

const protectNumber = (e) => {
    const value = e.target.value
    if(value.length === 2) {
        e.target.value = value.slice(0,1)
    }
}

const createGame = () => {
    loading.value = true
    socket.emit('create-room', username.value)
}

const joinRoom = () => {
    loading.value = true

    socket.emit('join-room', { 
        id: document.getElementById('field1').value + document.getElementById('field2').value + document.getElementById('field3').value, 
        username: username.value 
    })

}

function join(room) {
    loading.value = false
    router.push({ name: 'Game', query: { room: room.id } })
}

socket.on('room-joined', (room) => join(room))
socket.on('room-created', (room) => join(room))

</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
