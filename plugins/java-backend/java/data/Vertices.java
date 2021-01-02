package data;

import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/12/30
 */
public class Vertices extends BaseGeometry {
    int size;
    List<Double> position;

    public Vertices() {
        this.type = "Vertices";
    }

    public int getSize() {
        return size;
    }

    public List<Double> getPosition() {
        return position;
    }

    @Override
    public String toString() {
        return "Vertices{" +
                "size=" + size +
                ", position=" + position +
                ", type='" + type + '\'' +
                ", uuid='" + uuid + '\'' +
                ", matrix=" + matrix +
                ", properties=" + properties +
                '}';
    }
}
