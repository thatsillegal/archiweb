package data;

import wblut.geom.WB_AABB;
import wblut.geom.WB_AABB2D;
import wblut.geom.WB_Point;
import wblut.geom.WB_Polygon;

import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/12/30
 */
public class Plane extends BaseGeometry {
    Vector3 position;
    Param param;

    public WB_Polygon getWB_Polygon() {
        double w = param.w / 2;
        double h = param.h / 2;

        WB_Point p1 = new WB_Point(position.x - w, position.y - h);
        WB_Point p2 = new WB_Point(position.x + w, position.y - h);
        WB_Point p3 = new WB_Point(position.x + w, position.y + h);
        WB_Point p4 = new WB_Point(position.x - w, position.y + h);

        return new WB_Polygon(p1, p2, p3, p4);
    }

    @Override
    public String toString() {
        return "Plane{" +
                "position=" + position +
                ", param=" + param +
                ", type='" + type + '\'' +
                ", matrix=" + matrix +
                '}';
    }
}

class Vector3 {
    double x;
    double y;
    double z;

    @Override
    public String toString() {
        return "Vector3{" +
                "x=" + x +
                ", y=" + y +
                ", z=" + z +
                '}';
    }
}

class Param {
    double w;
    double h;

    @Override
    public String toString() {
        return "Param{" +
                "w=" + w +
                ", h=" + h +
                '}';
    }
}
