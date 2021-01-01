package main;

import Guo_Cam.CameraController;
import processing.core.PApplet;
import wblut.geom.*;
import wblut.processing.WB_Render;
import wblut.processing.WB_Render3D;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class Show extends PApplet {

    Server server;

    public static List<WB_Point> pts;
    public static WB_Polygon plane;

    public static List<WB_Polygon> plys;
    public static boolean draw = false;
    private WB_Render3D render;
    private CameraController cam;

    public void settings () {
       size(600, 800, P3D);
       server = new Server();
    }

    public void setup() {
        cam = new CameraController(this, 1000);

        render = new WB_Render(this);
    }

    public void draw() {
        if(draw) {
            background(221);
            cam.drawSystem(1000);

            stroke(0);
            render.drawPoint(pts, 2);
            render.drawPolygonEdges(plane);

            if(plys != null) render.drawPolygonEdges(plys);
        }
    }

    public static void calcVoronoi() {
       WB_Voronoi2D vor = WB_VoronoiCreator.getClippedVoronoi2D(pts, plane, 2);
       plys = new ArrayList<>();

       for(WB_VoronoiCell2D cell: vor.getCells()){
           plys.add(cell.getPolygon());
       }

       draw = true;
    }


}
