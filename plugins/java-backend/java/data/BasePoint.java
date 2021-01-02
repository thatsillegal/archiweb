package data;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2021/01/02
 */
public class BasePoint {
    public double x;
    public double y;
    public double z;

    public BasePoint(double x, double y, double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    @Override
    public String toString() {
        return "{" +
                "x=" + x +
                ", y=" + y +
                ", z=" + z +
                '}';
    }
}
