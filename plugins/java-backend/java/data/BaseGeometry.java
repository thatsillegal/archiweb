package data;

import com.google.gson.JsonObject;
import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public abstract class BaseGeometry {
    String type;
    String uuid;
    List<Double> matrix;
    JsonObject properties;
}

