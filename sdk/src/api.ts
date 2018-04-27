import axios, { AxiosError } from 'axios'
import { Expression } from './expression'

export const enum KarmaErrorType {
  RequestError = 'requestError',
  PermissionDeniedError = 'permissionDeniedError',
  DatabaseDoesNotExistError = 'databaseDoesNotExistError',
  ExecutionError = 'executionError',
  ObjectNotFoundError = 'objectNotFoundError',
  ModelNotFoundError = 'modelNotFoundError',
  CompilationError = 'compilationError',
  CodecError = 'codecError',
  InputParsingError = 'inputParsingError',
  ArgumentError = 'argumentError',
  DoNotationError = 'doNotationError',
  ModelParsingError = 'modelParsingError',
  InternalError = 'internalError',
  ConnectionError = 'connectionError',
  UnknownError = 'unknownError'
}

export interface KarmaResponseErrorData {
  humanReadableError: {
    human: string,
    machine: any
  }
}

export class KarmaError extends Error {
  public readonly type: KarmaErrorType = KarmaErrorType.ConnectionError
  public readonly data: any

  constructor(data?: KarmaResponseErrorData) {
    super()

    if (data) {
      // Currently not all errors are 'humanReadableError'
      if (data.humanReadableError) {
        const typeKey = Object.keys(data.humanReadableError.machine)[0]
        this.type = typeKey as KarmaErrorType
        this.message = data.humanReadableError.human
        this.data = data.humanReadableError.machine[typeKey]
      } else {
        const typeKey = Object.keys(data)[0]
        this.type = typeKey as KarmaErrorType
        this.data = (data as any)[typeKey]
      }
    }
  }
}

export type ObjectMap<T = any> = {[key: string]: T}

export interface Session {
  username: string
  signature: string
}

export const enum Codec {
  JSON = 'json'
}

export const CodedHeader = 'X-Karma-Codec'
export const SignatureHeader = 'X-Karma-Signature'

export function headersForSession(session?: Session, headers: ObjectMap = {}) {
  if (session) headers[SignatureHeader] = session.signature
  return headers
}

export function headersForCodec(codec: Codec, headers: ObjectMap = {}) {
  headers[CodedHeader] = codec
  return headers
}

export function bodyForData(data: any, codec: Codec) {
  switch (codec) {
    case Codec.JSON: return JSON.stringify(data)
  }
}

export async function postUploadRequest(
  url: string, data: any, session?: Session, codec = Codec.JSON
): Promise<any> {
  try {
    const headers: ObjectMap = headersForSession(session, headersForCodec(codec))

    const result = await axios.post(url, bodyForData(data, codec), {headers})
    return result.data
  } catch (e) {
    const err: AxiosError = e

    if (err.response && err.response.data) {
      throw new KarmaError(err.response.data)
    }

    throw new KarmaError()
  }
}

export async function postRequest(
  url: string, data: any, session?: Session, codec = Codec.JSON
): Promise<any> {
  try {
    const headers: ObjectMap = headersForSession(session, headersForCodec(codec))
    const result = await axios.post(url, bodyForData(data, codec), {headers})
    return result.data
  } catch (e) {
    const err: AxiosError = e

    if (err.response && err.response.data) {
      throw new KarmaError(err.response.data)
    }

    throw new KarmaError()
  }
}

export async function getBinaryRequest(
  url: string, session?: Session, codec = Codec.JSON
): Promise<any> {
  try {
    const headers: ObjectMap = headersForSession(session, headersForCodec(codec))
    const result = await axios.get(url, {headers, responseType: 'arraybuffer'})

    return result.data
  } catch (e) {
    const err: AxiosError = e

    if (err.response && err.response.data) {
      throw new KarmaError(err.response.data)
    }

    throw new KarmaError()
  }
}

export async function query(
  url: string, session: Session | undefined, expression: Expression, codec = Codec.JSON
) {
  return await postRequest(url, expression, session, codec)
}

export async function reset(
  url: string, session: Session | undefined, codec = Codec.JSON
) {
  await postRequest(url + '/admin/reset', undefined, session, codec)
}

export async function authenticate(
  url: string, username: string, password: string, codec = Codec.JSON
): Promise<Session> {
  const data = {username, password}
  const signature = await postRequest(url + '/auth', data, undefined, codec)

  return {username, signature}
}

export async function exportDB(
  url: string, session: Session | undefined, codec = Codec.JSON
): Promise<ArrayBuffer> {
  return await getBinaryRequest(url + '/admin/export', session, codec)
}

export async function importDB(
  url: string, session: Session | undefined, data: ArrayBuffer | Buffer, codec = Codec.JSON
) {
  return await postUploadRequest(url + '/admin/import', data, session, codec)
}

export class Client {
  public session?: Session
  public readonly url: string
  public readonly codec: Codec

  constructor(url: string, codec = Codec.JSON) {
    this.url = url
    this.codec = codec
  }

  public query(expression: Expression) {
    return query(this.url, this.session, expression, this.codec)
  }

  public async authenticate(username: string, password: string) {
    this.session = await authenticate(this.url, username, password, this.codec)
    return this.session
  }

  public reset() {
    return reset(this.url, this.session, this.codec)
  }

  public exportDB() {
    return exportDB(this.url, this.session, this.codec)
  }

  public importDB(data: ArrayBuffer | Buffer) {
    return importDB(this.url, this.session, data, this.codec)
  }
}
