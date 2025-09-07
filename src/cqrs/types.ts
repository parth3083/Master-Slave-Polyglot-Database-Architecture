export interface ICommand<Tpayload = unknown> {
  type: string;
  payload: Tpayload;
  timestamp: Date;
  id: string;
}

export interface IQuery<Tpayload = unknown> {
  type: string;
  payload: Tpayload;
  id: string;
}

export interface ICommandHandler<TCommand extends ICommand, TResult = unknown> {
  handle(command: TCommand): Promise<TResult>;
}

export interface IQueryHandler<Tquery extends IQuery, TResult = unknown> {
  handle(query: Tquery): Promise<TResult>;
}

// Interface for the queue message
export interface ISyncMessage {
  id: string;
  operation: "CREATE" | "UPDATE" | "DELETE";
  table: string;
  recordId: string;
  data: unknown;
  timestamp: Date;
  retryCount: number;
}
