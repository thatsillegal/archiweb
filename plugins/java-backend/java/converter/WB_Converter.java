package converter;

import data.BasePoint;
import data.Plane;
import data.Segments;
import data.Vertices;
import wblut.geom.WB_Coord;
import wblut.geom.WB_CoordCollection;
import wblut.geom.WB_Point;
import wblut.geom.WB_Polygon;

import java.util.ArrayList;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2021/01/02
 */
public class WB_Converter {
    public static List<WB_Point> toWB_Point(Vertices vs) {
        List<WB_Point> pts = new ArrayList<>();
        int size = vs.getSize();
        int count = vs.getPosition().size() / size;
        for(int i = 0; i < count; ++ i) {
            double[] pt = new double[size];
            for(int j = 0; j < size; ++ j) {
                pt[j] = vs.getPosition().get(i*size + j);
            }
            pts.add(new WB_Point(pt));
        }
        return pts;
    }

    public static WB_Polygon toWB_Polygon(Plane p) {
        BasePoint position = p.getPosition();
        double w = p.getW()/2.;
        double h = p.getH()/2.;

        WB_Point p1 = new WB_Point(position.x - w, position.y - h);
        WB_Point p2 = new WB_Point(position.x + w, position.y - h);
        WB_Point p3 = new WB_Point(position.x + w, position.y + h);
        WB_Point p4 = new WB_Point(position.x - w, position.y + h);

        return new WB_Polygon(p1, p2, p3, p4);
    }

    public static Segments toSegments(WB_Polygon ply) {
        Segments segments = new Segments();
        List<Double> positions = new ArrayList<>();
        int size = 3;

        WB_CoordCollection coords = ply.getPoints();
        for(int i = 0; i < coords.size(); ++ i) {
            WB_Coord c = coords.get(i);
            for(int j = 0; j < size; ++ j) {
                positions.add(c.getd(j));
            }
        }

        segments.setPositions(positions);
        segments.setSize(size);
        return segments;
    }

}
