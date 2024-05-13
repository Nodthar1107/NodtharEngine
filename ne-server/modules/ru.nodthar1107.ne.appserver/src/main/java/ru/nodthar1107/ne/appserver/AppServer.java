package ru.nodthar1107.ne.appserver;

import com.google.inject.AbstractModule;

public class AppServer
{
	private static int PORT = 8000;
	private static String HOST = "localhsot";
	
	private static String PATH_ARG = "--path";
	private static String projectPath;
	
	private AbstractModule[] modules;
	
	public static void main(String[] args) throws Exception
	{
		new AppServer().start(args);
	}
	
	private AppServer(AbstractModule... modules)
	{
		this.modules = modules;
	}
	
	private void start(String[] args) throws Exception
	{
		for (int index = 0; index < args.length; index++)
		{
			if (args[index].equals(PATH_ARG))
				projectPath = args[index + 1];
		}
		
		if (projectPath == null)
			throw new Exception("Project path wasn't passed as argument");
		
		new AppServerLauncher().launch(HOST, PORT, projectPath, modules);
	}
}
