package main;

import archijson.ArchiJSON;
import archijson.ArchiServer;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import converter.WB_Converter;
import geometry.Plane;
import geometry.Vertices;
import io.socket.client.Socket;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/12/31
 */
public class Server implements ArchiServer {
    public Generator generator;

    public Server(String... args) {
        generator = new Generator();
        ArchiServer.super.setup(args.length > 0 ? args[0] : SensitiveInfo.URL,
                SensitiveInfo.TOKEN, "java-backend");
    }

    @Override
    public void onReceive(Socket socket, String id, JsonObject body) {
        ArchiServer.super.onReceive(socket, id, body);

        Gson gson = new Gson();

        ArchiJSON archijson = gson.fromJson(body, ArchiJSON.class);
        archijson.parseGeometryElements(gson);

        generator.pts = WB_Converter.toWB_Point((Vertices) archijson.getGeometries().get(0));
        generator.plane = WB_Converter.toWB_Polygon((Plane) archijson.getGeometries().get(1));
        generator.calcVoronoi(archijson.getProperties().get("d").getAsDouble());

        ArchiJSON ret = generator.toArchiJSON(gson);
        ArchiServer.super.send(socket, "client", id, gson.toJson(ret));

    }
}
