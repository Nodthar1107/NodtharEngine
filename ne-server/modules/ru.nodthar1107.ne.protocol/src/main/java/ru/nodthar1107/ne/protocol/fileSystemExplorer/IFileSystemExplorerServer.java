package ru.nodthar1107.ne.protocol.fileSystemExplorer;

import java.net.URI;

import ru.nodthar1107.ne.jsonrpc.RpcMethod;
import ru.nodthar1107.ne.jsonrpc.RpcSegment;

@RpcSegment("FileSystemExplorer")
public interface IFileSystemExplorerServer {
	
	@RpcMethod("initialize")
	public FolderDescriptor initialize();
	
	@RpcMethod("addResource")
	public void createElement(URI folderUri, AbstractFileSystemNode node);
	
	@RpcMethod("renameElement")
	public void renameElement(URI uri, String name);
	
	@RpcMethod("removeElement")
	public void removeElement(URI uri);
}
