package main;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import java.util.List;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/11/23
 */
public class ArchiJSON {
    String id;
    List<JsonElement> geometries;
    Property properties;

    @Override
    public String toString() {
        return "ArchiJSON{" +
                "id='" + id + '\'' +
                ", geometries=" + geometries +
                ", properties=" + properties +
                '}';
    }
}
