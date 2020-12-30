package main;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import io.socket.client.Socket;
import sun.rmi.runtime.Log;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class Show {
    static public Socket socket;
    static public ArchiJSON archijson;
    public void setup() {

        socket.connect();

        socket.on("bts:receiveGeometry", args -> {
            System.out.println(args.length);
            System.out.println(args[0]);
            Gson gson = new Gson();
            // receive
            archijson = gson.fromJson(args[0].toString(), ArchiJSON.class);
            System.out.println(archijson.id);

            List<Geometry> geometries = new ArrayList<>();

            for(JsonElement e : archijson.geometries) {
                Geometry geom = fromJSONElements(e, gson);
                System.out.println(geom);
                geometries.add(geom);
            }
            System.out.println(geometries);


            System.out.println(archijson);
            // processing
        });
    }

    public Geometry fromJSONElements(JsonElement e, Gson gson) {
        String type = e.getAsJsonObject().get("type").getAsString();
        switch (type) {
            case "Points":
                return gson.fromJson(e, Points.class);
            case "Plane":
                return gson.fromJson(e, Plane.class);
            default:
                return null;
        }
    }

}
