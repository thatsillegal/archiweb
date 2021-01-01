package data;


import com.google.gson.Gson;
import com.google.gson.JsonElement;
import wblut.geom.WB_Coord;
import wblut.geom.WB_CoordCollection;
import wblut.geom.WB_Polygon;

import java.util.ArrayList;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2021/01/01
 */
public class Polygon extends BaseGeometry {
    int size;

    List<Double> positions;
    public Polygon() {
        this.type = "Shape";
    }

    public void fromWB_Polygon(WB_Polygon ply) {
        positions = new ArrayList<>();
        size = 3;

        WB_CoordCollection coords = ply.getPoints();
        for(int i = 0; i < coords.size(); ++ i) {
            WB_Coord c = coords.get(i);
            for(int j = 0; j < size; ++ j) {
                positions.add(c.getd(j));
            }
        }
    }

}
