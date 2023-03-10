import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { CldImage, CldUploadWidget } from 'next-cloudinary';

const inter = Inter({ subsets: ['latin'] });

interface UploadResult {
  info: {
    public_id: string;
    original_filename: string;
  };
}

const MEME_BACKGROUNDS = [
  {
    id: 'meme-backgrounds/5cwx89t4-1389586191_lfcpaf',
    alt: 'sample image',
    active: true,
  },
  {
    id: 'meme-backgrounds/85f2cb5f-44f8-4f2f-a813-63e657e11acc_5065cac7_g2zw1m',
    alt: 'sample image',
    active: false,
  },
  {
    id: 'meme-backgrounds/4a5001b7beea096457f480c8808572428b-09-roll-safe.2x.h473.w710_d3sfdy',
    alt: 'sample image',
    active: false,
  },
];

export default function Home() {
  const [topText, setTopText] = useState('This is a cool');
  const [bottomText, setBottomText] = useState('meme generator');
  const [background, setBackground] = useState(MEME_BACKGROUNDS[0].id);
  const [memes, setMemes] = useState(MEME_BACKGROUNDS);

  useEffect(() => {
    if (localStorage.getItem('meme_backgrounds') !== null) {
      const savedBgs = JSON.parse(localStorage.getItem('meme_backgrounds')!);
      setMemes(savedBgs);

      const activeBg = savedBgs.find((bg: any) => bg.active === true);
      setBackground(activeBg.id);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('top_text') !== null) {
      const savedTopText = localStorage.getItem('top_text');
      setTopText(savedTopText!);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('bottom_text') !== null) {
      const savedBottomText = localStorage.getItem('bottom_text');
      setBottomText(savedBottomText!);
    }
  }, []);

  const handleTopText = useCallback((e: any) => {
    localStorage.setItem('top_text', e.target.value);
    setTopText(e.target.value);
  }, []);

  const handleBottomText = useCallback((e: any) => {
    localStorage.setItem('bottom_text', e.target.value);
    setBottomText(e.target.value);
  }, []);

  const handleOnBackgroundChange = useCallback(
    (id: string) => {
      const updatedBackgrounds = memes.map((background) => {
        if (background.id === id) {
          return { ...background, active: true };
        } else {
          return { ...background, active: false };
        }
      });

      setBackground(id);
      localStorage.setItem(
        'meme_backgrounds',
        JSON.stringify(updatedBackgrounds)
      );
      setMemes(updatedBackgrounds);
    },
    [memes]
  );

  const handleBackgroundUpload = useCallback(
    (result: any) => {
      setBackground(result.info.public_id);
      const newBackgrounds = [
        ...memes.map((background) => {
          return {
            ...background,
            active: false,
          };
        }),
        {
          id: result.info.public_id,
          alt: result.info.original_filename,
          active: true,
        },
      ];

      localStorage.setItem('meme_backgrounds', JSON.stringify(newBackgrounds));
      setMemes(newBackgrounds);
    },
    [memes]
  );

  return (
    <>
      <Head>
        <title>Cloudinary Meme Generator</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <div className={styles.center}>
          <div>
            <form>
              <h1 className='text-xl mb-4 font-bold text-black'>
                Cloudinary Meme Generator
              </h1>
              <div className='mt-1'>
                <label
                  htmlFor='top text'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Top Text
                </label>
                <div>
                  <input
                    type='text'
                    name='top text'
                    id='top text'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='Top text'
                    onChange={handleTopText}
                    value={topText}
                  />
                </div>
              </div>

              <div className='mt-1'>
                <label
                  htmlFor='bottom text'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Bottom Text
                </label>
                <div>
                  <input
                    type='text'
                    name='bottom text'
                    id='bottom text'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    placeholder='Bottom text'
                    onChange={handleBottomText}
                    value={bottomText}
                  />
                </div>
              </div>

              <div className='mt-4'>
                {memes && (
                  <>
                    <label className='block text-sm mb-1 font-medium leading-6 text-gray-900'>
                      Backgrounds
                    </label>
                    <ul className={styles.backgrounds}>
                      {memes.map(({ id, alt, active }) => (
                        <li
                          key={id}
                          onClick={() => handleOnBackgroundChange(id)}
                          className={active ? styles.active : ''}
                        >
                          <CldImage
                            alt={alt}
                            src={id}
                            crop='fill'
                            gravity='auto'
                            width='150'
                            height='150'
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div>
                <CldUploadWidget
                  uploadPreset='cloudinary-meme-generator'
                  onUpload={handleBackgroundUpload}
                >
                  {({ open }) => {
                    function handleOnClick(e: any) {
                      e.preventDefault();
                      open();
                    }
                    return (
                      <button
                        type='button'
                        onClick={handleOnClick}
                        className='rounded-full bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      >
                        Upload an Image
                      </button>
                    );
                  }}
                </CldUploadWidget>
              </div>
            </form>
          </div>
          <div className={styles.image}>
            {background && (
              <CldImage
                width='640'
                height='640'
                crop='fill'
                alt='sample image'
                gravity='auto'
                src={background}
                overlays={[
                  {
                    width: 2670 - 20,
                    crop: 'fit',
                    position: {
                      x: 0,
                      y: 50,
                      gravity: 'north',
                    },
                    text: {
                      color: 'white',
                      fontFamily: 'Source Sans Pro',
                      fontSize: 80,
                      fontWeight: 'bold',
                      text: topText,
                      stroke: true,
                      border: '20px_solid_black',
                    },
                  },
                  {
                    width: 2670 - 20,
                    crop: 'fit',
                    position: {
                      x: 0,
                      y: 50,
                      gravity: 'south',
                    },
                    text: {
                      color: 'white',
                      fontFamily: 'Source Sans Pro',
                      fontSize: 80,
                      fontWeight: 'bold',
                      text: bottomText,
                      stroke: true,
                      border: '20px_solid_black',
                    },
                  },
                ]}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
