package ru.nodthar1107.ne.protocol.fileSystemExplorer;

import java.net.URI;

public class ResourceDescriptor extends AbstractFileSystemNode
{
	public ResourceDescriptor(URI uri, ResourceType type)
	{
		super(uri, type);
	}
}
