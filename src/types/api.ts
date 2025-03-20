export type ErrorResponseData = {
  message: string;
  details: { messages: string[] }[];
}

export type ErrorResponse = {
  status?: number;
  data?: ErrorResponseData;
}
