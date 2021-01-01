package main;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import data.ArchiJSON;
import data.Plane;
import data.Points;
import data.Polygon;
import io.socket.client.IO;
import io.socket.client.Socket;
import wblut.geom.WB_AABB;
import wblut.geom.WB_Polygon;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/12/31
 */
public class Server {
    Socket socket;
    ArchiJSON archijson;

    public Server(String... args) {
        try {
            if (args.length > 0) {
                socket = IO.socket(args[0]);

                this.setup();
                System.out.println("Socket connected to " + args[0]);
            } else {
                int port = 27781;
                String uri = "http://127.0.0.1:" + port;

                socket = IO.socket(uri);

                this.setup();
                System.out.println("Socket connected to " + uri);
            }

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }


    public void setup() {

        socket.connect();

        socket.on("bts:receiveGeometry", args -> {
            System.out.println(args.length);
            System.out.println(args[0]);
            System.out.println(socket.id());
            Gson gson = new Gson();
            // receive
            archijson = gson.fromJson(args[0].toString(), ArchiJSON.class);
            System.out.println(archijson.getId());
            archijson.parseGeometryElements(gson);

            Show.pts = ((Points)archijson.getGeometries().get(0)).getWB_Points();
            Show.plane = ((Plane) archijson.getGeometries().get(1)).getWB_Polygon();
            List<WB_Polygon> plys = Show.calcVoronoi(archijson.getProperties().getD());

            ArchiJSON ret = new ArchiJSON();
            ret.setId(archijson.getId());
            List<JsonElement> elements = new ArrayList<>();
            for(WB_Polygon ply : plys) {
                Polygon p = new Polygon();
                p.fromWB_Polygon(ply);

                elements.add(gson.toJsonTree(p));
            }
            ret.setGeometryElements(elements);

            socket.emit("stb:sendGeometry",gson.toJson(ret));

//            System.out.println(gson.toJson(ret));
            // processing
        });
    }




}
