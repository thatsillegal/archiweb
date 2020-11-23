package main;

import java.util.Arrays;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class Geometry {
    String type;
    List<Double> matrix;

    @Override
    public String toString() {
        return "Type: " + type + '\n'
                + "Matrix: " + matrix + '\n';
    }
}
