import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'cookies-next';

type LoginRequestBody = {
  username: string,
  password: string
}

type LoginRemoteResponse = {
  s: string,
  "2faToken": string,
  e: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as LoginRequestBody;
  if (!body.username || !body.password) {
    return res.redirect("/?error=WrongAccount")
  }

  fetch("http://localhost:8080/login", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: body.username,
      password: body.password
    })
  }).then(e => e.json())
    .then((json: LoginRemoteResponse) => {
      console.log(json);
      if (json["s"] === "true") {
        if (json["2faToken"]) {
          res.redirect("/2fa")
        }
        else {
          setCookie("username", body.username, { req, res, maxAge: 60 * 60 * 24 });
          res.redirect("/settings")
        }
      }
      else {
        res.redirect("/?error=WrongAccount")
      }
    })


}
