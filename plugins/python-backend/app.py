from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

# only log error
import logging

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:8080")
CORS(app)


@socketio.on('connect')
def on_connect():
    print('connected')


@socketio.on('paramExchange')
def handle_param(data):
    print(data)
    # param = json.loads(str(data))
    # print(param)
    emit('generate', 'hello, i received')


if __name__ == '__main__':
    socketio.run(app, debug=True)
