package main;

import com.google.gson.Gson;
import data.ArchiJSON;
import data.Plane;
import data.Points;
import io.socket.client.IO;
import io.socket.client.Socket;
import wblut.geom.WB_AABB;

import java.net.URISyntaxException;

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
            Show.calcVoronoi();

            System.out.println(archijson);
            // processing
        });
    }



}
