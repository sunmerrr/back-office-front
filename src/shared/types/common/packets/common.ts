// TODO: 일단 기존 데이터 구조 유지
export interface IPacket<T, K> {
  to?: {
    name: string;
    id: string;
  };
  from?: {
    name: string;
    id: string;
  };
  cmd: T; // packet enum
  data: K; // packet interface
  status?: number;
  msg?: string;
}

export type HandlerFunction<T, K> = (
  packet: T,
  ws: K
) => any | void | IPacket<any, any> | string;
