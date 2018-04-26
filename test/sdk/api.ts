import axios, { AxiosError } from 'axios'

export const enum KarmaErrorType {
  RequestError = 'RequestError',
  PermissionError = 'PermissionError',
  ServerError = 'ServerError',
  ConnectionError = 'ConnectionError',
  UnknownError = 'UnknownError'
}

export interface KarmaResponseErrorData {
  humanReadableError: {
    human: string,
    machine: any
  }
}

export class KarmaError {
  public readonly type: KarmaErrorType

  public readonly errorMessage?: string
  public readonly errorData?: string

  constructor(type: KarmaErrorType, data?: KarmaResponseErrorData) {
    this.type = type
  }
}

export interface Session {
  username: string
  signature: string
}

export const enum Codec {
  JSON = 'json'
}

export const CodedHeader = 'X-Karma-Signature'
export const SignatureHeader = 'X-Karma-Signature'

export function headersForSession(session: Session, headers = new Headers()) {
  headers.append(SignatureHeader, session.signature)
  return headers
}

export function headersForCodec(codec: Codec, headers = new Headers()) {
  headers.append(CodedHeader, codec)
  return headers
}

export type Expression = any

export function bodyForExpression(expression: Expression, codec = Codec.JSON) {
  switch (codec) {
    case Codec.JSON: return JSON.stringify(expression)
  }
}


export async function postRequest(url: string, headers: Headers | undefined, body: string): Promise<any> {
  try {
    const result = await axios.post(url, body, {headers})
    return result.data
  } catch (e) {
    const err: AxiosError = e

    if (err.response) {
      const statusCode = err.response.status

      if (statusCode > 400) {
        if (statusCode === 401 || statusCode === 403) throw new KarmaError(KarmaErrorType.PermissionError, err)
        throw new KarmaError(KarmaErrorType.RequestError, err)
      }
    }

    throw new KarmaError(KarmaErrorType.UnknownError, err)
  }
}

export async function query(url: string, session: Session, expression: Expression, codec = Codec.JSON) {
  // return await postRequest(
  //   url,
  //   headersForSession(session, headersForCodec(codec)),
  //   bodyForExpression(expression, codec)
  // )
}

export async function login(url: string, username: string, password: string): Promise<Session> {
  const bla = await postRequest(url, undefined, JSON.stringify({
    username, password
  }))

  return {signature: '', username: ''}
}
