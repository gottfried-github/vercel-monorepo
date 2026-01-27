export class FetchDataError<Body> extends Error {
  response: Response
  body: Body

  constructor(response: Response, body: Body, message?: string, options?: ErrorOptions) {
    super(message, options)

    this.response = response
    this.body = body
  }
}

export const fetchData = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options)

  const resBody = await res.json()

  if (!res.ok) {
    throw new FetchDataError(res, resBody)
  }

  return resBody
}
