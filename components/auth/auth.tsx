import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAppContext } from '@/lib/context';
import { useSearchParams } from 'next/navigation';
import Logo from '../global/logo';

const Auth = ({
  title,
  subtitle,
  children,
  type,
  querySuffix,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  type: string;
  querySuffix?: string;
}) => {
  const { handleResendOTP } = useAppContext();
  const params = useSearchParams();
  const email = params.get('qemail');
  return (
    <div className='bg-gray-50 min-h-screen pt-16'>
      <div className='-mt-16 min-h-screen bg-gray-50'>
        <div className='flex min-h-screen'>
          <div className='flex flex-1 flex-col px-6 py-6'>
            <div className='flex items-center gap-4 pb-16 lg:pb-0'>
              <Logo />
            </div>
            <div className='mb-24 flex flex-1 flex-col lg:justify-center'>
              <div className='mx-auto w-full max-w-[400px]'>
                <div className='text-center'>
                  <h2 className='mb-4 mt-6 text-4xl font-bold text-gray-900'>
                    {title}
                  </h2>
                  <p className='text-base text-gray-400'>
                    Need an account?{' '}
                    <a
                      className='font-semibold text-green-600 hover:text-green-700'
                      href={title === 'Login' ? '/signup' : '/login'}
                    >
                      {title === 'Login' ? 'Register' : 'Login'}
                    </a>
                  </p>
                </div>
                <div className='mt-8 flex flex-col gap-6'>
                  {children}
                  {type !== 'verify-otp' && (
                    <>
                      {title === 'Login' ? (
                        <>
                          <p className='px-8 text-center text-sm text-muted-foreground'>
                            Don&apos;t have an account?{' '}
                            <Link
                              href={`/signup${querySuffix}`}
                              className='underline underline-offset-4 hover:text-primary'
                            >
                              Signup now
                            </Link>{' '}
                          </p>
                        </>
                      ) : (
                        <p className='px-8 text-center text-sm text-muted-foreground'>
                          Already have an account?{' '}
                          <Link
                            href={`/login${querySuffix}`}
                            className='underline underline-offset-4 hover:text-primary'
                          >
                            Login now
                          </Link>{' '}
                        </p>
                      )}
                    </>
                  )}

                  {type === 'verify-otp' && (
                    <div className='flex justify-center items-center text-center text-sm text-muted-foreground'>
                      Didn&apos;t receive the OTP?{' '}
                      <Button
                        variant='special'
                        onClick={() => handleResendOTP({ email })}
                        className='underline underline-offset-4 hover:text-primary'
                      >
                        Resend OTP
                      </Button>{' '}
                    </div>
                  )}

                  {(type === 'login' || type === 'signup') && (
                    <>
                      <div className='flex w-full items-center gap-2'>
                        <div className='h-1/2 grow border-t border-gray-200' />
                        <p className='text-base gap-x-2 !text-gray-400'>OR</p>
                        <div className='h-1/2 grow border-t border-gray-200' />
                      </div>

                      <Button className='flex items-center text-center justify-center bg-white dark:bg-gray-900 border border-gray-300 px-6 py-2 text-gray-800 hover:bg-gray-200'>
                        <svg
                          className='h-6 w-6 mr-2'
                          xmlns='http://www.w3.org/2000/svg'
                          xmlnsXlink='http://www.w3.org/1999/xlink'
                          width='800px'
                          height='800px'
                          viewBox='-0.5 0 48 48'
                          version='1.1'
                        >
                          {' '}
                          <title>Google-color</title>{' '}
                          <desc>Created with Sketch.</desc> <defs> </defs>{' '}
                          <g
                            id='Icons'
                            stroke='none'
                            strokeWidth={1}
                            fill='none'
                            fillRule='evenodd'
                          >
                            {' '}
                            <g
                              id='Color-'
                              transform='translate(-401.000000, -860.000000)'
                            >
                              {' '}
                              <g
                                id='Google'
                                transform='translate(401.000000, 860.000000)'
                              >
                                {' '}
                                <path
                                  d='M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24'
                                  id='Fill-1'
                                  fill='#FBBC05'
                                >
                                  {' '}
                                </path>{' '}
                                <path
                                  d='M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333'
                                  id='Fill-2'
                                  fill='#EB4335'
                                >
                                  {' '}
                                </path>{' '}
                                <path
                                  d='M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667'
                                  id='Fill-3'
                                  fill='#34A853'
                                >
                                  {' '}
                                </path>{' '}
                                <path
                                  d='M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24'
                                  id='Fill-4'
                                  fill='#4285F4'
                                >
                                  {' '}
                                </path>{' '}
                              </g>{' '}
                            </g>{' '}
                          </g>{' '}
                        </svg>
                        <span>Continue with Google</span>
                      </Button>
                    </>
                  )}

                  <div>
                    <p className='text-center text-xs text-gray-500'>
                      By creating an account or signing in, you agree to our{' '}
                      <a
                        className='font-semibold text-green-600 hover:text-green-700'
                        target='_blank'
                        href='https://earnbetter.com/tos/'
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        target='_blank'
                        className='font-semibold text-green-600 hover:text-green-700'
                        href='https://earnbetter.com/privacy/'
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='relative hidden w-0 flex-1 lg:block'>
            <Image
              alt='Earnbetter Login Background'
              width={3000}
              height={2000}
              className='absolute inset-0 h-full w-full object-cover'
              src='/urinvited_login.svg'
              // style={{ filter: 'brightness(70%)' }}
            />
            {/* <div className='absolute left-20 top-1/3 mt-8'>
              <h3 className='mb-3 text-2xl font-bold leading-10 tracking-tight text-white'>
                100% Free. Seriously.
              </h3>
              <li className='pl-2 text-lg text-white'>Professional Resume</li>
              <li className='pl-2 text-lg text-white'>
                Personalized Job Matches
              </li>
              <li className='pl-2 text-lg text-white'>Generated Custom Docs</li>
              <li className='pl-2 text-lg text-white'>Interview Support</li>
              <div className='text-md absolute inset-x-0 mt-8 rounded-bl-xl rounded-tl-xl rounded-tr-xl bg-opacity-70 bg-gradient-to-r from-blue-100 to-green-100 px-4 py-4 text-left leading-7 text-gray-700'>
                &quot;I got a job after 9 months of unemployment...I am so
                grateful for EarnBetter!&quot;{' '}
                <p className='breakwords'>-Dawn</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
