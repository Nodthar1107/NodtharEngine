package ru.nodthar1107.ne.protocol.fileSystemExplorer;

import java.net.URI;
import java.util.List;

public class FolderDescriptor extends AbstractFileSystemNode
{
	private final List<FolderDescriptor> folders;
	private final List<ResourceDescriptor> resources;
	
	public FolderDescriptor(URI uri, ResourceType type, List<FolderDescriptor> folders, List<ResourceDescriptor> resources)
	{
		super(uri, type);
		
		this.folders = folders;
		this.resources = resources;
	}

	public List<FolderDescriptor> getFolders() {
		return folders;
	}

	public List<ResourceDescriptor> getResources() {
		return resources;
	}
}
