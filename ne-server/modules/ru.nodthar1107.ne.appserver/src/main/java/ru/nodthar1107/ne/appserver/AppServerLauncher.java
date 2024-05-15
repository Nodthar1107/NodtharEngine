package ru.nodthar1107.ne.appserver;

import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.security.NoSuchAlgorithmException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;

import ru.nodthar1107.ne.appserver.dispatcher.IApplicationDispatcher;
import ru.nodthar1107.ne.jsonrpc.RpcMessage;
import ru.nodthar1107.ne.jsonrpc.RpcMethod;
import ru.nodthar1107.ne.jsonrpc.RpcSegment;
import ru.nodthar1107.ne.network.WebSocket;

public class AppServerLauncher {
	private static Logger LOGGER = LoggerFactory.getLogger(AppServerLauncher.class);
	
	private WebSocket socket;
	private Gson gson;
	
	private IApplicationDispatcher dispatcher;

	public void launch(String host, int port, String projectPath, AbstractModule... modules) throws NoSuchAlgorithmException, IOException {
		Injector injector = Guice.createInjector(modules);
		gson = new GsonBuilder().create();

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
			invokeServerDispatcherHandler(message);
		}
	}
	
	@SuppressWarnings("unused")
	private void invokeServerDispatcherHandler(String message)
	{
		try
		{
			RpcMessage rpcMessage = gson.fromJson(message, RpcMessage.class);
			String[] rpcMethod = rpcMessage.getMethod().split("/");
			
			Method targetMethod = null;
			for (Class<?> _interface : IApplicationDispatcher.class.getInterfaces())
			{
				Annotation segmentAnnotaion = _interface.getAnnotation(RpcSegment.class);
				if (segmentAnnotaion != null && ((RpcSegment) segmentAnnotaion).value().equals(rpcMethod[0]))
				{
					for (Method method :_interface.getMethods())
					{
						Annotation methodAnnotation = method.getAnnotation(RpcMethod.class);
						if (methodAnnotation != null && ((RpcMethod) methodAnnotation).value().equals(rpcMethod[1]))
						{
							targetMethod = method;
							return;
						}
					}
				}
			}
			
			if (targetMethod == null)
			{
				LOGGER.error("Handler for rpc \"%s\" wasn't found", rpcMessage.getMethod());
				
				return;
			}
			
			Object result = targetMethod.invoke(dispatcher, gson.fromJson(rpcMessage.getParams(), targetMethod.getParameterTypes()[0]));
		}
		catch (JsonSyntaxException e) {
			LOGGER.error("Rpc message parse error", e);
		}
		catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
	}
}
