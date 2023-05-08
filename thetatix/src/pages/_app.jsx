import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/styles/globals.css'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}