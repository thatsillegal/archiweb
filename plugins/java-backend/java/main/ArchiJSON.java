package main;

import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class ArchiJSON {
    List<Geometry> archijson;

    @Override
    public String toString() {
        String str = "";
        str += "Geometry len: " + archijson.size() + '\n';
        for(int i = 0; i < archijson.size(); ++ i) {
            str += archijson.get(i);
        }
        return str;
    }
}
