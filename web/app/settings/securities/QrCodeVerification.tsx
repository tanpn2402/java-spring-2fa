'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { getCookie } from 'cookies-next';

const QrCodeVerification = () => {
  const [qrCodeSrc, setQrCodeSrc] = useState<String | null>(null);
  const inputCodeRef = useRef<HTMLInputElement>(null);

  const onVerify = useCallback(() => {
    fetch("/api/2fa/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: getCookie("username"),
        code: inputCodeRef.current?.value
      })
    }).then(e => e.json())
      .then((json: { success: boolean, error?: string }) => {
        if (json.success) {
          alert("Successfully!");
        }
        else {
          alert("Error: " + json.error);
        }
      })
      .catch((err: Error) => {
          alert("Error: " + err.message);
      })
  }, [inputCodeRef]);

  const onGetQrCode = useCallback(() => {
    // get QR code
    fetch("/api/2fa/qrcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: getCookie("username")
      })
    }).then(e => e.json())
      .then((json: { src?: string }) => {
        if (json.src) {
          setQrCodeSrc(json.src);
        }
      })
      .catch((err: Error) => {
        console.log(err.message);
      })
  }, []);

  useEffect(() => {
    // on-loaded

  }, []);

  return <>
    <button type="button"
      onClick={onGetQrCode}
      data-bs-toggle="modal"
      data-bs-target="#staticBackdrop"
      className="text-gray-900 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-amber-300 dark:focus:ring-amber-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4 mr-2 mb-2"
    >
      Enable two-factor authentication
    </button>
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
            <div className="p-6">
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-8">
                You're enabling Two-Factor Authentication for your accout. Follow the instructions to complete setup.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <img src={qrCodeSrc as string} />
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
                            ref={inputCodeRef}
                            className="form-control block w-full px-3 py-1.5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-amber-600 focus:outline-none focus:shadow-none" />
                        </div>
                        <div className="form-group mb-6">
                          <button type="button"
                            onClick={onVerify}
                            className="inline-block px-6 py-2.5 bg-amber-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-amber-700 hover:shadow-lg focus:bg-amber-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-amber-800 active:shadow-lg transition duration-150 ease-in-out">
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

export default QrCodeVerification;