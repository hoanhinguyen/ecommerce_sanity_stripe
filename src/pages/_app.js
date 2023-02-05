import '../styles/globals.css';
import { Layout } from '../../components';
import { StateContext } from 'context/StateContext';
import {Toaster} from 'react-hot-toast';

export default function MyApp({ Component, pageProps }) {
    return (
        <StateContext>
            <Layout>
                <Toaster />
                <Component {...pageProps} />
            </Layout>
        </StateContext>
        )
  }