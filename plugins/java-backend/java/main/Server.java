package main;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import converter.WB_Converter;
import geometry.Plane;
import geometry.Vertices;
import io.socket.client.Ack;
import io.socket.client.IO;
import io.socket.client.Socket;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/12/31
 */
public class Server {
    private Socket socket;
    public Generator generator;


    public Server(String... args) {
        try {
            if (args.length > 0) {
                socket = IO.socket(args[0]);
                this.setup();
                System.out.println("Socket connected to " + args[0]);
            } else {
                socket = IO.socket(SensitiveInfo.URL);
                this.setup();
                System.out.println("Socket connected to " + SensitiveInfo.URL);
            }

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }


    public void setup() {

        generator = new Generator();
        Gson gson = new Gson();

        socket.connect();


        socket.on(Socket.EVENT_CONNECT, args -> {
            JsonObject o = new JsonObject();
            o.addProperty("token", SensitiveInfo.TOKEN);
            o.addProperty("identity", "java-backend");

            socket.emit("register", gson.toJson(o), (Ack) this::printStatus);
        });

        socket.on("receive", args -> {
            JsonObject ctx = gson.fromJson(String.valueOf(args[0]), JsonObject.class);
            String id = ctx.get("id").getAsString();
            JsonObject body = ctx.get("body").getAsJsonObject();

            ArchiJSON archijson = gson.fromJson(body, ArchiJSON.class);
            archijson.parseGeometryElements(gson);

            generator.pts = WB_Converter.toWB_Point((Vertices) archijson.getGeometries().get(0));
            generator.plane = WB_Converter.toWB_Polygon((Plane) archijson.getGeometries().get(1));
            generator.calcVoronoi(archijson.getProperties().get("d").getAsDouble());

            ArchiJSON ret = generator.toArchiJSON(gson);
            JsonObject o = new JsonObject();
            o.addProperty("to", "client");
            o.addProperty("id", id);
            o.addProperty("body", gson.toJson(ret));

            socket.emit("exchange", gson.toJson(o), (Ack) this::printStatus);
        });


//        socket.on("bts:exampleReceiveGeometry", args -> {
//            // receive
//            ArchiJSON archijson = gson.fromJson(args[0].toString(), ArchiJSON.class);
//            archijson.parseGeometryElements(gson);
//
//            // processing
//            generator.pts = WB_Converter.toWB_Point((Vertices) archijson.getGeometries().get(0));
//            generator.plane = WB_Converter.toWB_Polygon((Plane) archijson.getGeometries().get(1));
//            generator.calcVoronoi(archijson.getProperties().get("d").getAsDouble());
//
//            // return
//            socket.emit("stb:sendGeometry",gson.toJson(ret));
//
//        });
    }


    public void printStatus(Object[] obj) {
        try {
            JSONObject response = (JSONObject) obj[0];
            System.out.println(response.getString("status"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

}
