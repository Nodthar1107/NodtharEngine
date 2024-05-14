package ru.nodthar1107.ne.appserver;

import org.glassfish.tyrus.server.Server;

import com.google.inject.AbstractModule;

import jakarta.websocket.DeploymentException;

public class AppServer
{
	private static int PORT = 8000;
	private static String HOST = "localhost";
	
	private static String PATH_ARG = "--path";
	
	private static String projectPath;
	
	private AbstractModule[] modules;
	
	public static void main(String[] args)
	{
		new AppServer().launch(args);
	}
	
	private AppServer(AbstractModule... modules)
	{
		this.modules = modules;
	}
	
	private void launch(String[] args)
	{
		for (int index = 0; index < args.length; index++)
		{
			if (args[index].equals(PATH_ARG))
				projectPath = args[index + 1];
		}
		
		if (projectPath == null)
			throw new RuntimeException("Path to project wasn't set");
		
		try
		{
			new AppServerLauncher().launch(HOST, PORT, projectPath, modules);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}
