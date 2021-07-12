import {io} from 'socket.io-client'
import {uri} from '@/sensitiveInfo'
// const socket = io("ws://localhost:27781/")
// const socket = '';
// uri = uri || "ws://localhost:27781";
const socket = io(uri);
export default socket