package ru.nodthar1107.ne.appserver;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;

public class AppServerLauncher {
	private ServerSocket server;
	private Socket socket;
	private InputStream in;
	private OutputStream out;

	public void launch(String host, int port, String projectPath, AbstractModule... modules) throws NoSuchAlgorithmException, IOException {
		Injector injector = Guice.createInjector(modules);

//		IApplicationDispatcher dispatcher = injector.getInstance(IApplicationDispatcher.class);

		try {
			System.out.println("Server started. Waiting for connection...");
			server = new ServerSocket(port, 1, InetAddress.getByName("localhost"));
			socket = server.accept();
			
			in = socket.getInputStream();
			out = socket.getOutputStream();
			Scanner s = new Scanner(in, "UTF-8");
			
			System.out.println(String.format("Connesction is set. Remote address: %s",
					socket.getInetAddress().toString()));
			
			String data = s.useDelimiter("\\r\\n\\r\\n").next();
			Matcher get = Pattern.compile("^GET").matcher(data);
			if (get.find()) {
				  Matcher match = Pattern.compile("Sec-WebSocket-Key: (.*)").matcher(data);
				  match.find();
				  byte[] response = ("HTTP/1.1 101 Switching Protocols\r\n"
				    + "Connection: Upgrade\r\n"
				    + "Upgrade: websocket\r\n"
				    + "Sec-WebSocket-Accept: "
				    + Base64.getEncoder().encodeToString(MessageDigest.getInstance("SHA-1").digest((match.group(1) + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").getBytes("UTF-8")))
				    + "\r\n\r\n").getBytes("UTF-8");
				  out.write(response, 0, response.length);
			}
			
			listen();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		finally
		{
			in.close();
			out.close();
				
			socket.close();
		}
	}
	
	private void listen() throws IOException
	{
		while (true)
		{
			byte[] encoded = new byte[1024];
			int count = in.read(encoded);
			System.out.println(count);
			String message = decode(encoded, count);
			System.out.println(String.format("Message: %s", message));
		}
	}
	
	private String decode(byte[] encoded, int count)
	{
		byte[] decoded = new byte[count];
		byte[] key = new byte[] { (byte) 167, (byte) 225, (byte) 225, (byte) 210 };
		for (int index = 0; index < count; index++)
		{
			System.out.print(String.format("%d ", encoded[index]));
			decoded[index] = (byte) (encoded[index] ^ key[index & 0x3]);
		}
		
		System.out.println();
		
		return new String(decoded);
	}
}
