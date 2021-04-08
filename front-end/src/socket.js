import {io} from 'socket.io-client'

const socket = io("ws://10.192.27.111:39201/")

// const socket = process.env.NODE_ENV === 'development' ? io('ws://127.0.0.1:27781') : io('wss://web.archialgo.com');
// const socket = ""
export default socket