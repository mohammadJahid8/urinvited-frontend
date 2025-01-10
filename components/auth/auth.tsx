import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAppContext } from '@/lib/context';
import { useSearchParams } from 'next/navigation';

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
              <Link className='shrink-0' href='/'>
                Urinvited
              </Link>
              <div className='bg-white shadow-sm flex h-8 w-fit shrink-0 items-center justify-start gap-2 rounded-full pr-4'>
                <svg
                  width={32}
                  height={32}
                  viewBox='0 0 32 32'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className=' shrink-0 rounded-full shadow-md'
                >
                  <circle
                    cx={16}
                    cy={16}
                    r='15.3333'
                    fill='url(#gradient-56473308-bed0-48e7-a727-9c98e8ea23c6)'
                    stroke='white'
                    strokeWidth='1.33333'
                  />
                  <circle cx={16} cy={16} r='10.6667' fill='white' />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M20.4434 9.61408C20.372 9.25702 20.0585 9 19.6944 9C19.3303 9 19.0167 9.25702 18.9453 9.61408L18.7631 10.5251C18.7027 10.8275 18.4663 11.0638 18.1639 11.1243L17.2529 11.3065C16.8959 11.3779 16.6388 11.6914 16.6388 12.0556C16.6388 12.4197 16.8959 12.7332 17.2529 12.8046L18.1639 12.9868C18.4663 13.0473 18.7027 13.2837 18.7631 13.5861L18.9453 14.497C19.0167 14.8541 19.3303 15.1111 19.6944 15.1111C20.0585 15.1111 20.372 14.8541 20.4434 14.497L20.6256 13.5861C20.6861 13.2837 20.9225 13.0473 21.2249 12.9868L22.136 12.8046C22.493 12.7332 22.7499 12.4197 22.7499 12.0556C22.7499 11.6914 22.493 11.3779 22.136 11.3065L21.2249 11.1243C20.9225 11.0638 20.6861 10.8275 20.6256 10.5251L20.4434 9.61408ZM13.5441 12.5779C13.4401 12.266 13.1483 12.0556 12.8195 12.0556C12.4907 12.0556 12.1987 12.266 12.0947 12.5779L11.5725 14.1449C11.4964 14.373 11.3175 14.552 11.0894 14.628L9.52232 15.1503C9.21039 15.2543 9 15.5462 9 15.875C9 16.2038 9.21039 16.4957 9.52232 16.5997L11.0894 17.122C11.3175 17.198 11.4964 17.377 11.5725 17.6051L12.0947 19.1721C12.1987 19.484 12.4907 19.6944 12.8195 19.6944C13.1483 19.6944 13.4401 19.484 13.5441 19.1721L14.0665 17.6051C14.1425 17.377 14.3214 17.198 14.5495 17.122L16.1166 16.5997C16.4285 16.4957 16.6388 16.2038 16.6388 15.875C16.6388 15.5462 16.4285 15.2543 16.1166 15.1503L14.5495 14.628C14.3214 14.552 14.1425 14.373 14.0665 14.1449L13.5441 12.5779ZM18.1666 18.1667C18.4954 18.1667 18.7873 18.3771 18.8913 18.689L19.0317 19.1101C19.1077 19.3382 19.2867 19.5172 19.5148 19.5933L19.936 19.7336C20.2479 19.8376 20.4583 20.1295 20.4583 20.4583C20.4583 20.7871 20.2479 21.079 19.936 21.183L19.5148 21.3234C19.2867 21.3994 19.1077 21.5784 19.0317 21.8065L18.8913 22.2277C18.7873 22.5396 18.4954 22.75 18.1666 22.75C17.8378 22.75 17.5459 22.5396 17.4419 22.2277L17.3015 21.8065C17.2255 21.5784 17.0465 21.3994 16.8184 21.3234L16.3973 21.183C16.0853 21.079 15.875 20.7871 15.875 20.4583C15.875 20.1295 16.0853 19.8376 16.3973 19.7336L16.8184 19.5933C17.0465 19.5172 17.2255 19.3382 17.3015 19.1101L17.4419 18.689C17.5459 18.3771 17.8378 18.1667 18.1666 18.1667Z'
                    fill='url(#gradient-56473308-bed0-48e7-a727-9c98e8ea23c6)'
                  />
                  <defs>
                    <linearGradient
                      id='gradient-56473308-bed0-48e7-a727-9c98e8ea23c6'
                      x1='6.52956'
                      y1='4.576'
                      x2='20.7892'
                      y2='27.5453'
                      gradientUnits='userSpaceOnUse'
                    >
                      <stop stopColor='#AD7EE1' />
                      <stop offset='0.376174' stopColor='#636FCB' />
                      <stop offset={1} stopColor='#087279' />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
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
              src='/auth-img.jpg'
              style={{ filter: 'brightness(70%)' }}
            />
            <div className='absolute left-20 top-1/3 mt-8'>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
