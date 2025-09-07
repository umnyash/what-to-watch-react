import { FlattenNestedRecords } from '../types';
import { ErrorResponse } from '../../services/api';
import { loginResponseErrorDetailMessages } from '../../services/api/const';

const loginResponseErrorPropertyByMessage = new Map(
  Object.entries(loginResponseErrorDetailMessages).flatMap(([property, messages]) =>
    Object.values(messages).map((message) => [message, property])
  )
);

export const getMockLoginError = (...errorMessages: FlattenNestedRecords<typeof loginResponseErrorDetailMessages>[]): ErrorResponse => {
  const messagesByProperty: Record<string, string[]> = {};

  errorMessages.forEach((message) => {
    const property = loginResponseErrorPropertyByMessage.get(message);

    if (property) {
      messagesByProperty[property] ??= [];
      messagesByProperty[property].push(message);
    } else {
      throw new Error(`There is no "${message}" message provided.`);
    }
  });

  return {
    data: {
      message: 'Validation error',
      details: Object.values(messagesByProperty).map((messages) => ({ messages }))
    }
  };
};
