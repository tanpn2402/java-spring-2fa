import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useRef } from 'react'
import { useRouter } from 'next/router'

type Props = {
  data: {
    v: string
  }
}

const Index = (props: Props) => {
  const router = useRouter();
  const usernameRef = useRef(null);
  const codeRef = useRef(null);

  const handleSubmit = useCallback((ev: any) => {
    ev.preventDefault();
    if (usernameRef !== null && codeRef !== null) {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // @ts-ignore
          username: usernameRef.current?.value,
          // @ts-ignore
          password: codeRef.current?.value
        })
      };

      fetch('https://tanpn2402-crispy-space-bassoon-vpvv45xw9xwfxvrv-8080.preview.app.github.dev/login', options)
        .then(response => response.json())
        .then(response => {
          if (response.s === String(true)) {
            router.push("/profile");
          }
        })
        .catch(err => console.error(err));
    }
  }, [usernameRef, codeRef]);

  return <>
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={ev => handleSubmit(ev)}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                ref={usernameRef}
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                ref={codeRef}
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-amber-500 focus:outline-none focus:ring-amber-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-amber-500 py-2 px-4 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
}

export default Index;

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:8080/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      username: "user1"
    })
  });
  const data: Props = await res.json();


  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}