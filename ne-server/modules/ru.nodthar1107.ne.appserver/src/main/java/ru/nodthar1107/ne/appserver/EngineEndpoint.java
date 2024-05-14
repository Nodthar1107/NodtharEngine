package ru.nodthar1107.ne.appserver;

import java.io.IOException;

import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import ru.nodthar1107.ne.appserver.dispatcher.IApplicationDispatcher;

@ServerEndpoint(value="/engine")
public class EngineEndpoint
{
	private IApplicationDispatcher dispatcher;
	
	@OnOpen
	public void onOpen(Session session) throws IOException
	{
		System.out.println("Connected");
	}
	
	@OnMessage
	public void onMessage(String message, Session session) throws IOException
	{
		System.out.println(message);
	}
	
	@OnError
	public void onError(Session session, Throwable throwable)
	{
		// Error handling
	}
}
