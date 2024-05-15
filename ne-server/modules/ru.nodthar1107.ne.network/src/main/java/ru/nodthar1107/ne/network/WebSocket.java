package ru.nodthar1107.ne.network;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebSocket {
	private static final Logger LOGGER = LoggerFactory.getLogger(WebSocket.class);
	
	private final int port;
	private final String host;
	private ServerSocket server;
	private Socket socket;
	private BufferedInputStream in;
	private BufferedOutputStream out;
	
	public WebSocket(int port, String host)
	{
		this.port = port;
		this.host = host;
	}
	
	public void handshake()
	{
		try
		{
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
		}
		catch (Exception e)
		{
			LOGGER.error("WebSocket handshake error", e);
		}
	}
	
	public String readMessage()
	{
		try
		{	
			// Read first byte
			in.read();
			
			int sizeDescriptor = in.read();
			long messageSize = 0;
			if (sizeDescriptor - 128 <= 125) {
				messageSize = sizeDescriptor - 128;
			}
			else if (sizeDescriptor - 128 == 126)
			{
				byte[] size = new byte[2];
				in.read(size);
				
				messageSize = (long) (((size[0] & 0xFF) << 8) | (size[1] & 0xFF));
			}
			else if (sizeDescriptor - 128 == 127)
			{
				byte[] size = new byte[8];
				in.read(size);
				
				messageSize = (long) ((size[0] & 0xFF) << 56 | (size[1] & 0xFF) << 48 | (size[2] & 0xFF) << 40 | (size[3] & 0xFF) << 32 |
						(size[4] & 0xFF) << 24 | (size[5] & 0xFF) << 16 | (size[6] & 0xFF) << 8 | (size[7] & 0xFF));
			}
			
			byte[] key = new byte[4];
			in.read(key);
			
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
			LOGGER.error("Websocket reading message error", e);
		}
		
		return null;
	}
	
	public void writeMessgae(String message)
	{
		try
		{
			out.write(0x81);
			byte[] buffer = message.getBytes();
			
			if (buffer.length < 126)
			{
				out.write(buffer.length + 128);
				out.write(buffer.length);
			}
			else if (buffer.length < 65536)
			{
				out.write(126);
				out.write((buffer.length >> 8) & 0xFF);
				out.write(buffer.length & 0xFF);
			}
			else
			{
				out.write(127);
				out.write((buffer.length >> 56) & 0xFF);
				out.write((buffer.length >> 48) & 0xFF);
				out.write((buffer.length >> 40) & 0xFF);
				out.write((buffer.length >> 32) & 0xFF);
				out.write((buffer.length >> 24) & 0xFF);
				out.write((buffer.length >> 16) & 0xFF);
				out.write((buffer.length >> 8) & 0xFF);
				out.write(buffer.length & 0xFF);
			}
			
			out.write(buffer);
			
			out.flush();
		}
		catch (Exception e) {
			LOGGER.error("Websocket writing message error", e);
		}
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
