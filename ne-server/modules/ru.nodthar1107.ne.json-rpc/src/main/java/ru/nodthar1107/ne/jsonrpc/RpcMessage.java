package ru.nodthar1107.ne.jsonrpc;

public class RpcMessage
{
	private final long timestamp;
	private final String method;
	private final String params;
	
	public RpcMessage(long timestamp, String method, String params)
	{
		this.timestamp = timestamp;
		this.method = method;
		this.params = params;
	}
	
	public long getTimestamp()
	{
		return timestamp;
	}
	
	public String getMethod()
	{
		return method;
	}
	
	public String getParams()
	{
		return params;
	}
	
	
}
