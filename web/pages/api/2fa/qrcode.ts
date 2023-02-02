import type { NextApiRequest, NextApiResponse } from 'next'

type QrCodeRequestBody = {
  username: string
}

type QrCodeRemoteResponse = {
  s: string,
  m: string,
  v: string,
  e: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as QrCodeRequestBody;
  if (!body.username) {
    return res.status(500).send({
      error: "Invalid user"
    })
  }

  fetch("http://localhost:8080/2fa/generate-qrcode", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: body.username
    })
  }).then(e => e.json())
    .then((json: QrCodeRemoteResponse) => {
      console.log(json);
      if (json["s"] === "true") {
        res.status(200).send({
          src: json["v"]
        })
      }
      else {
        res.status(500).send({
          error: json["e"]
        })
      }
    })
}
