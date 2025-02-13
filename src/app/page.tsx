'use client';
import { upload } from '@/actions/index';
import { FileUpload } from '@/components/ui/file-upload';
import { dropValidation, renderBytes } from '@/lib/utils';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';
import { useState } from 'react';
import { FileRejection, FileWithPath } from 'react-dropzone';

export default function Home() {
	const [accepted_files, set_accepted_files] = useState<File[] | undefined>();
	const [rejected_files, set_rejected_files] = useState<FileRejection[] | undefined>();

	return (
		<div className='flex h-full flex-1'>
			<div className='flex flex-1 flex-col'>
				<FileUpload
					onDropAccepted={(accepted) => {
						console.info(accepted.length);
						set_accepted_files(accepted);
					}}
					onDropRejected={(rejected) => {
						console.info(rejected.length);
						set_rejected_files(rejected);
					}}
					className='h-full w-full'
					accepted={accepted_files}
					rejected={rejected_files}
					maxFiles={Infinity}
					validator={dropValidation}
					multiple
					noClick
					noKeyboard
					preventDropOnDocument
				/>
				<div>dropped files stats or warnings about privacy idk</div>
				<button
					className='py-8'
					onClick={() =>
						upload(
							(accepted_files || []).map((_f) => ({
								_f: _f,
								_p: _f.path,
							}))
						)
					}
				>
					submit
				</button>
			</div>
			<div className='flex flex-1 flex-col'>
				<file_tree_viewer files={accepted_files || []} />
			</div>
		</div>
	);
}

interface TreeNode {
	isFile: boolean;
	children: Record<string, TreeNode>;
	size: number;
}

interface TreeNodeProps {
	name: string;
	node: TreeNode;
	level?: number;
}

interface FileTreeViewerProps {
	files: FileWithPath[];
}

const file_tree_viewer: React.FC<FileTreeViewerProps> = ({ files }) => {
	// Convert flat paths into a tree structure
	const create_tree_structure = (f: FileWithPath[]): Record<string, TreeNode> => {
		const root: Record<string, TreeNode> = {};

		f.forEach((_file) => {
			const parts = (_file.path || '').split('/').filter(Boolean);
			let current = root;

			parts.forEach((part, index) => {
				if (!current[part]) {
					current[part] = {
						isFile: index === parts.length - 1,
						children: {},
						size: _file.size,
					};
				}
				current = current[part].children;
			});
		});

		return root;
	};

	// Sort function to put folders first, then files, both alphabetically
	const sort_nodes = (entries: [string, TreeNode][]): [string, TreeNode][] => {
		return entries.sort((a, b) => {
			const [name_a, node_a] = a;
			const [name_b, node_b] = b;

			// If both are files or both are folders, sort alphabetically
			if (node_a.isFile === node_b.isFile) {
				return name_a.localeCompare(name_b);
			}

			// If one is a file and one is a folder, put folder first
			return node_a.isFile ? 1 : -1;
		});
	};

	// Component for a single tree node (file or folder)
	const tree_node: React.FC<TreeNodeProps> = ({ name, node, level = 0 }) => {
		const [is_open, set_is_open] = useState<boolean>(false);
		const has_children = Object.keys(node.children).length > 0;

		const handle_click = () => {
			if (has_children) {
				set_is_open(!is_open);
			}
		};

		return (
			<div className='select-none'>
				<div
					className='flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800'
					style={{ paddingLeft: `${level * 20}px` }}
					onClick={handle_click}
					role='button'
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							handle_click();
						}
					}}
				>
					{has_children ? (
						<span className='mr-1 h-4 w-4'>
							{is_open ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
						</span>
					) : (
						<span className='mr-1 h-4 w-4'></span>
					)}

					{node.isFile ? <File className='mr-2 h-4 w-4' /> : <Folder className='mr-2 h-4 w-4' />}

					<span className='inline-flex w-full items-center justify-between'>
						<span className='text-sm'>{name}</span>
						{node.isFile && (
							<span className='font-light text-xs text-zinc-600 tracking-wide'>
								{renderBytes(node.size)}
							</span>
						)}
					</span>
				</div>

				{has_children && is_open && (
					<div role='group'>
						{sort_nodes(Object.entries(node.children)).map(([childName, childNode]) => (
							<tree_node key={childName} name={childName} node={childNode} level={level + 1} />
						))}
					</div>
				)}
			</div>
		);
	};

	const tree_data = create_tree_structure(files);

	return (
		<div
			className='w-full max-w-2xl rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-900'
			role='tree'
		>
			{sort_nodes(Object.entries(tree_data)).map(([name, node]) => (
				<tree_node key={name} name={name} node={node} />
			))}
		</div>
	);
};
