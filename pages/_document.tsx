import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from 'next/document';
import Script from 'next/script';
import { NEXT_PUBLIC_GOOGLE_ANALYTICS } from '../app/constants/constants';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link rel='preconnect' href='https://fonts.gstatic.com' />
					<link
						href='https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap'
						rel='stylesheet'
					/>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link rel='preconnect' href='https://fonts.gstatic.com' />
					<link
						href='https://fonts.googleapis.com/css2?family=Rubik+Gemstones&display=swap'
						rel='stylesheet'
					/>
					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link rel='preconnect' href='https://fonts.gstatic.com' />
					<link
						href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap'
						rel='stylesheet'
					/>
					<link rel='shortcut icon' href={'./images/logo3.png'} />
					<title>FoodiesBooth</title>
					<meta
						name='keywords'
						content={'Food,Restaturent,Catering,Baking,Cake,Burger'}
					/>
					<meta
						name='description'
						content={'A marketplace for Food Businesses, making memories'}
					/>
				</Head>
				<body className='bg-white text-black'>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
