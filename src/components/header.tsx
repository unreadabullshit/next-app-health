import { ModeToggle } from './dark-mode-switch';

function Header() {
	return (
		<div className='flex justify-between px-8 py-4'>
			<h1>Next App Health</h1>
			<ModeToggle />
		</div>
	);
}

export { Header };
