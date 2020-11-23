import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

import { GCP_MAPS_KEY } from 'lib/config'

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <script
            type="text/javascript"
            src={`https://maps.google.com/maps/api/js?key=${GCP_MAPS_KEY}`}
            async
          />
        </Head>
        <style>
          {`
            #__next { height: 100% }
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
