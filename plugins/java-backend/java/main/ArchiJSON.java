package main;

import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class ArchiJSON {
    String id;
    List<Geometry> archijson;

    @Override
    public String toString() {
        String str = "";
        str += "Geometry len: " + archijson.size() + '\n';
        for (Geometry geom : archijson) {
            str += geom;
        }
        return str;
    }
}
