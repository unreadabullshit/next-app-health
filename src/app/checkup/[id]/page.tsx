import { Browser } from '@/components/ui/browser';
import { ComboBoxResponsive } from './_components/url';

interface PageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
	await props.params.then((v) => console.info(v.id));

	return (
		<div className='flex h-full w-full flex-1 flex-col p-12'>
			<Browser
				searchBar={
						<ComboBoxResponsive />
				}
			>
				<section className={'flex h-full w-full items-center justify-center'}>
					<h1 className={'text-base md:text-xl'}>Hi!</h1>
				</section>
			</Browser>
		</div>
	);
}
