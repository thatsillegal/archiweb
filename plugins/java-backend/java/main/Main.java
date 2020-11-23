package main;

import io.socket.client.IO;

import java.net.URISyntaxException;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class Main {
    public static void main(String[] args) {
        try {
            if (args.length > 0) {
                Show.socket = IO.socket(args[0]);
                System.out.println("Socket connected to " + args[0]);
            } else {
                Show.socket = IO.socket("http://127.0.0.1:27781");
                System.out.println("Socket connected to http://127.0.0.1:27781");
            }
//         PApplet.main("main.Show");
            Show show = new Show();
            show.setup();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

    }
}
