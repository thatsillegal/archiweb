package data;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/12/30
 */
public class Plane extends BaseGeometry {
    BasePoint position;
    int w;
    int h;

    public Plane() {
        this.type = "Plane";
    }

    public BasePoint getPosition() {
        return position;
    }

    public int getW() {
        return w;
    }

    public int getH() {
        return h;
    }

    @Override
    public String toString() {
        return "Plane{" +
                "position=" + position +
                ", w=" + w +
                ", h=" + h +
                ", type='" + type + '\'' +
                ", uuid='" + uuid + '\'' +
                ", matrix=" + matrix +
                ", properties=" + properties +
                '}';
    }
}
