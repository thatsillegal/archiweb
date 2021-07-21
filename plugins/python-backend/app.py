import sys
sys.path.append('../archijson/python')

from geometry import Mesh, Faces, Vertices
from archijson import ArchiServer, ArchiJSON
from sensitive_info import URL, TOKEN
from formfinding import from_vertices_and_faces
from converter.compas import to_mesh

server = ArchiServer(URL, TOKEN, 'python-backend')

def chunk(l, n):
    for i in range(0, len(l), n):
        yield l[i:i + n]


def on_receive(id, body):
    # print(id, body)
    print(body)
    archijson = ArchiJSON(body)
    mesh = archijson.geometries[0]
    vs = mesh.vertices.toList()
    fs = mesh.faces.toList()
    
    # vs = list(chunk(body['vertex'], 3))
    # fs = body['face']

    form = from_vertices_and_faces(vs, fs)
    print(type(form))
    v, f = form.to_vertices_and_faces()
    mesh = to_mesh(v, f)

    server.send('client', mesh.data, id)

server.on_receive = on_receive
