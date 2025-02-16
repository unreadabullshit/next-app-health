import { BrowserComponent } from '@/components/ui/browser';

interface PageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
	await props.params.then((v) => console.info(v.id));

	return (
		<div className='flex h-full w-full flex-1 flex-col p-12'>
			<BrowserComponent>
				<section className={'flex h-full w-full items-center justify-center'}>
					<h1 className={'text-base md:text-xl'}>Hi!</h1>
				</section>
			</BrowserComponent>
		</div>
	);
}
