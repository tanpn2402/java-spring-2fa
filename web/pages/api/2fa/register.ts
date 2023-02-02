import type { NextApiRequest, NextApiResponse } from 'next'

type RegisterRequestBody = {
  username: string,
  code: string
}

type RegisterRemoteResponse = {
  s: string,
  e: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as RegisterRequestBody;
  if (!body.username) {
    return res.status(500).send({
      error: "Invalid user"
    })
  }

  fetch("http://localhost:8080/2fa/register", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: body.username,
      code: body.code
    })
  }).then(e => e.json())
    .then((json: RegisterRemoteResponse) => {
      console.log(json);
      res.status(200).send({
        success: json["s"] === "true",
        error: json["e"]
      })
    })
}
