package main;

import Guo_Cam.CameraController;
import processing.core.PApplet;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class LocalDisplay extends PApplet {

    private Server server;
    private CameraController cam;

    public void settings() {
        size(600, 800, P3D);
        smooth(8);
        server = new Server();
    }

    public void setup() {
        cam = new CameraController(this, 1000);
    }

    public void draw() {
        background(221);
        cam.drawSystem(1000);
        server.generator.draw(this);
    }

    public static void main(String[] args) {
        if (args.length > 0) {
            new Server(args);
        } else {
            PApplet.main("main.LocalDisplay");
        }
    }
}
