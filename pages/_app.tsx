
import type { AppProps } from 'next/app'
import '../styles/index.css'
import { Provider } from 'react-redux';
import { store } from '../app/store/store';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PRODUCTION_CLIENT_ID } from '../app/constants/constants';




const initialOptions = {
  "client-id": PRODUCTION_CLIENT_ID,
};


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PayPalScriptProvider options={initialOptions}>
        < Component {...pageProps} />
      </PayPalScriptProvider>
    </Provider>




  )

}

export default MyApp
