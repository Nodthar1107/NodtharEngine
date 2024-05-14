package ru.nodthar1107.ne.appserver;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
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
	private BufferedInputStream in;
	private BufferedOutputStream out;

	public void launch(String host, int port, String projectPath, AbstractModule... modules) throws NoSuchAlgorithmException, IOException {
		Injector injector = Guice.createInjector(modules);

//		IApplicationDispatcher dispatcher = injector.getInstance(IApplicationDispatcher.class);

		try {
			System.out.println("Server started. Waiting for connection...");
			server = new ServerSocket(port, 1, InetAddress.getByName("localhost"));
			socket = server.accept();
			
			in = new BufferedInputStream(socket.getInputStream());
			out = new BufferedOutputStream(socket.getOutputStream());
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
				  out.flush();
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
			String message = readMessage();
			System.out.println(String.format("Message: %s", message));
			byte[] res = ("Aboba biba").getBytes("UTF-8");
			out.write(res, 0, res.length);
			out.flush();
		}
	}
	
	private String readMessage()
	{
		try
		{	
			// Read first byte
			in.read();
			
			int sizeDescriptor = in.read();
			int messageSize = 0;
			int offset = 0;
			if (sizeDescriptor - 128 <= 125) {
				messageSize = sizeDescriptor - 128;
				offset = 2;
			}
			else if (sizeDescriptor - 128 == 126)
			{
				byte[] size = new byte[2];
				in.read(size);
				
				messageSize = (int) (((size[0] & 0xFF) << 8) | (size[1] & 0xFF));
				offset = 4;
			}
			else if (sizeDescriptor - 128 == 127)
			{
				byte[] size = new byte[4];
				in.read(size);
				
				messageSize = (int) ((size[0] & 0xFF) << 24 | (size[1] & 0xFF) << 16 | (size[2] & 0xFF) << 8 | (size[3] & 0xFF));
				offset = 6;
			}
			
			byte[] key = new byte[4];
			in.read(key);
			offset += 4;
			
			byte[] buffer = new byte[1024];
			StringBuilder builder = new StringBuilder();
			while (messageSize > 0)
			{
				int readed = in.read(buffer);
				messageSize -= readed;
				
				builder.append(decode(buffer, key, readed));
			}
			
			return builder.toString();
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		
		return null;
	}
	
	private String decode(byte[] buffer, byte[] key, int length)
	{
		byte[] decoded = new byte[length];
		for (int index = 0; index < length; index++)
		{
			decoded[index] = (byte)(buffer[index] ^ key[index & 0x3]);
		}
		
		return new String(decoded);
	}
}
