import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie, setCookie } from 'cookies-next';

type VerifyRequestBody = {
  username?: string,
  code: string
}

type VerifyRemoteResponse = {
  s: string,
  t: string,
  e: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as VerifyRequestBody;
  if (!body.code) {
    return res.status(500).send({
      error: "Invalid code"
    })
  }

  fetch("http://localhost:8080/2fa/verify", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: getCookie("username", { req, res }),
      code: body.code
    })
  }).then(e => e.json())
    .then((json: VerifyRemoteResponse) => {
      console.log(json);
      if (json["s"] === "true") {
        setCookie("token", json.t, { req, res, maxAge: 60 * 60 * 24 });
        res.redirect("/settings")
      }
      else {
        res.redirect("/2fa?error=InvalidCode")
      }
    })
}
