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

import ru.nodthar1107.ne.network.WebSocket;

public class AppServerLauncher {
	private WebSocket socket;

	public void launch(String host, int port, String projectPath, AbstractModule... modules) throws NoSuchAlgorithmException, IOException {
		Injector injector = Guice.createInjector(modules);

//		IApplicationDispatcher dispatcher = injector.getInstance(IApplicationDispatcher.class);

		socket = new WebSocket(port, host);
		socket.handshake();
		
		listen();
	}
	
	private void listen() throws IOException
	{
		while (true)
		{
			String message = socket.readMessage();
		}
	}
}
