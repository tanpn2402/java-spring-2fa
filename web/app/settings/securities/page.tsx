
const ProfilePage = () => {
  return <>
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Account securities</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Change password and protect my account.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Two-factor Authentication</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <p>Two-factor authentication protects your account from malicious activity by verifying you are in possession of a registered device on each login attempt.</p>
              <button type="button"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
                className="text-gray-900 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-amber-300 dark:focus:ring-amber-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 mr-2 mb-2"
              >
                Enable two-factor authentication
              </button>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Application for</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Backend Developer</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Salary expectation</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">$120,000</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">About</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur
              qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud
              pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <div className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto"
      id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1}
      aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog my-0 relative w-auto h-full flex items-center pointer-events-none">
        <div
          className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current bg-white rounded-lg shadow dark:bg-gray-700">
          <div
            className="modal-header flex flex-shrink-0 items-center justify-between px-4 rounded-t-md">
            <div className="px-6 py-4 rounded-t">
              <h3 className="text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                Enable Two-factor Authentication
              </h3>
            </div>

            <div className="px-6">
              <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-bs-dismiss="modal" aria-label="Close"
              >
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>

          </div>
          <div className="modal-body relative px-4">

            {/* <!-- Modal body --> */}
            <div className="p-6">
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-8">
                You're enabling Two-Factor Authentication for your accout. Follow the instructions to complete setup.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <img src="http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcSh-wrQu254qFaRcoYktJ5QmUhmuUedlbeMaQeaozAVD4lh4ICsGdBNubZ8UlMvWjKC" />
                </div>
                <div className="text-sm font-normal text-gray-500 dark:text-gray-200">
                  <ol>
                    <li>1. Download and install Authenticator app such as Authy, Google Authenticator</li>
                    <li className="my-4">2. Scan this QR-code</li>
                    <li>
                      <div className="mb-3">3. Enter Verification Code</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group mb-6">
                          <input type="text"
                            placeholder="Code"
                            className="form-control block w-full px-3 py-1.5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-amber-600 focus:outline-none" />
                        </div>
                        <div className="form-group mb-6">
                          <button type="button" className="inline-block px-6 py-2.5 bg-amber-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-amber-700 hover:shadow-lg focus:bg-amber-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-amber-800 active:shadow-lg transition duration-150 ease-in-out">
                            VERIFY
                          </button>
                        </div>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </>
}

export default ProfilePage;