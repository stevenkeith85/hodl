// pages/_document.js

import Document, { Html, Head, Main, NextScript } from 'next/document'

import theme from '../theme';
import createEmotionServer from '@emotion/server/create-instance';
import { createEmotionCache } from '../createEmotionCache';

class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
        enhanceComponent: (Component) => Component,
    })

    const initialProps = await Document.getInitialProps(ctx);

    const { extractCriticalToChunks } = createEmotionServer(cache);
    const chunks = extractCriticalToChunks(initialProps.html);
    const styles = chunks.styles.map(style => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {...initialProps, styles}
  }

  render() {
    return (
      <Html>
        <Head>
        <meta name="theme-color" content={theme.palette.primary.main} />
        <link rel="preconnect" href="https://res.cloudinary.com/" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka&display=swap"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,500" />
        {this.props.styles}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}


export default MyDocument