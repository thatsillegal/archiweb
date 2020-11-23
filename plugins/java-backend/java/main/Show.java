package main;

import com.google.gson.Gson;
import io.socket.client.Socket;

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

            System.out.println(archijson);
            // processing
        });
    }


}
