import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

import { GCP_MAPS_KEY } from 'lib/config'

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link rel="stylesheet" type="text/css" href="/nprogress.css" />
          <link rel="preload" href="/fonts/Manrope-Regular.ttf" as="font" crossOrigin="anonymous" />
          <link
            rel="preload"
            href="/fonts/Manrope-SemiBold.ttf"
            as="font"
            crossOrigin="anonymous"
          />
          <link rel="preload" href="/fonts/Manrope-Bold.ttf" as="font" crossOrigin="anonymous" />
          <script
            type="text/javascript"
            src={`https://maps.google.com/maps/api/js?key=${GCP_MAPS_KEY}`}
            async
          />
        </Head>
        <style>
          {`
            #__next { height: 100% }
            body {
              font-family: "Manrope", sans-serif;
            }
          `}
        </style>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
