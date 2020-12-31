package main;

import com.google.gson.Gson;
import data.ArchiJSON;
import io.socket.client.IO;
import io.socket.client.Socket;
import processing.core.PApplet;
import sun.rmi.runtime.Log;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.Enumeration;

/**
 * @classname: archiweb
 * @description:
 * @author: amomorning
 * @date: 2020/12/31
 */
public class Server {
    Socket socket;
    ArchiJSON archijson;

    public Server(String[] args) {
        try {
            if (args.length > 0) {
                socket = IO.socket(args[0]);

                this.setup();
                Thread.sleep(5000);
                System.out.println("Socket connected to " + args[0]);
            } else {
                InetAddress addr = getLocalHostLANAddress();
                String IP = addr.getHostAddress();
                int PORT = 27781;

                String uri = "http://" + IP + ":" + PORT;

                socket = IO.socket(uri);
                this.setup();

                Thread.sleep(2000);
                System.out.println("Socket " + socket.id() + " connected to " + uri);
                PApplet.main("main.Show");
            }

        } catch (URISyntaxException | UnknownHostException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void setup() {

        socket.connect();

        socket.on("bts:receiveGeometry", args -> {
            System.out.println(args.length);
            System.out.println(args[0]);
            System.out.println(socket.id());
            Gson gson = new Gson();
            // receive
            archijson = gson.fromJson(args[0].toString(), ArchiJSON.class);
            System.out.println(archijson.getId());
            archijson.parseGeometryElements(gson);

            System.out.println(archijson);
            // processing
        });
    }

    private static InetAddress getLocalHostLANAddress() throws UnknownHostException {
        try {
            InetAddress candidateAddress = null;
            // 遍历所有的网络接口
            for (Enumeration ifaces = NetworkInterface.getNetworkInterfaces(); ifaces.hasMoreElements();) {
                NetworkInterface iface = (NetworkInterface) ifaces.nextElement();
                // 在所有的接口下再遍历IP
                for (Enumeration inetAddrs = iface.getInetAddresses(); inetAddrs.hasMoreElements();) {
                    InetAddress inetAddr = (InetAddress) inetAddrs.nextElement();
                    if (!inetAddr.isLoopbackAddress()) {// 排除loopback类型地址
                        if (inetAddr.isSiteLocalAddress()) {
                            // 如果是site-local地址，就是它了
                            return inetAddr;
                        } else if (candidateAddress == null) {
                            // site-local类型的地址未被发现，先记录候选地址
                            candidateAddress = inetAddr;
                        }
                    }
                }
            }
            if (candidateAddress != null) {
                return candidateAddress;
            }
            // 如果没有发现 non-loopback地址.只能用最次选的方案
            InetAddress jdkSuppliedAddress = InetAddress.getLocalHost();
            if (jdkSuppliedAddress == null) {
                throw new UnknownHostException("The JDK InetAddress.getLocalHost() method unexpectedly returned null.");
            }
            return jdkSuppliedAddress;
        } catch (Exception e) {
            UnknownHostException unknownHostException = new UnknownHostException(
                    "Failed to determine LAN address: " + e);
            unknownHostException.initCause(e);
            throw unknownHostException;
        }
    }
}
