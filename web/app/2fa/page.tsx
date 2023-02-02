export default function TwoFAPage() {
  return <>
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="my-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Two Factor Authentication
          </h2>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-800 mb-8">
            Enter Verification Code. Verification code can be found in your authentication app: <strong>Authy</strong>, <strong>Google Authenticator</strong>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="/api/2fa/verify" method="post">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group mb-6">
              <input
                type="text"
                name="code"
                placeholder="Code"
                className="form-control block w-full px-3 py-1.5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-amber-600 focus:outline-none focus:shadow-none" />
            </div>
            <div className="form-group mb-6">
              <button type="submit" className="inline-block px-6 py-2.5 bg-amber-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-amber-700 hover:shadow-lg focus:bg-amber-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-amber-800 active:shadow-lg transition duration-150 ease-in-out">
                VERIFY
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </>
}