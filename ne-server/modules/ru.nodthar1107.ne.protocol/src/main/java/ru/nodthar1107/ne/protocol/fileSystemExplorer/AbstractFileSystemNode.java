package ru.nodthar1107.ne.protocol.fileSystemExplorer;

import java.net.URI;

public abstract class AbstractFileSystemNode {
	private final URI uri;
	private final ResourceType type;
	
	public AbstractFileSystemNode(URI uri, ResourceType type)
	{
		this.uri = uri;
		this.type = type;
	}

	public URI getUri() {
		return uri;
	}

	public ResourceType getType() {
		return type;
	}
}
