package data;

import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2021/01/01
 */
public class Segments extends BaseGeometry {
    int size;
    List<Double> positions;
    public Segments() {
        this.type = "Segments";
    }

    public void setSize(int size) {
        this.size = size;
    }

    public void setPositions(List<Double> positions) {
        this.positions = positions;
    }

    @Override
    public String toString() {
        return "Segments{" +
                "size=" + size +
                ", positions=" + positions +
                ", type='" + type + '\'' +
                ", uuid='" + uuid + '\'' +
                ", matrix=" + matrix +
                ", properties=" + properties +
                '}';
    }
}
