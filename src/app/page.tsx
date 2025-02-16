'use client';
import { upload } from '@/actions/index';
import { FileUpload } from '@/components/ui/file-upload';
import { dropValidation, renderBytes } from '@/lib/utils';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';
import { useState } from 'react';
import { FileRejection, FileWithPath } from 'react-dropzone';

export default function Home() {
	const [acceptedFiles, setAcceptedFiles] = useState<File[] | undefined>();
	const [rejectedFiles, setRejectedFiles] = useState<
		FileRejection[] | undefined
	>();

	return (
		<div className='flex h-full flex-1'>
			<div className='flex flex-1 flex-col'>
				<FileUpload
					onDropAccepted={(accepted) => {
						console.info(accepted.length);
						setAcceptedFiles(accepted);
					}}
					onDropRejected={(rejected) => {
						console.info(rejected.length);
						setRejectedFiles(rejected);
					}}
					className='h-full w-full'
					accepted={acceptedFiles}
					rejected={rejectedFiles}
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
							(acceptedFiles || []).map((_f) => ({
								_f: _f,
								// @ts-expect-error
								_p: _f.path,
							}))
						)
					}
				>
					submit
				</button>
			</div>
			<div className='flex flex-1 flex-col'>
				<FileTreeViewer files={acceptedFiles || []} />
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

const FileTreeViewer: React.FC<FileTreeViewerProps> = ({ files }) => {
	// Convert flat paths into a tree structure
	const createTreeStructure = (f: FileWithPath[]): Record<string, TreeNode> => {
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
	const sortNodes = (entries: [string, TreeNode][]): [string, TreeNode][] => {
		return entries.sort((a, b) => {
			const [nameA, nodeA] = a;
			const [nameB, nodeB] = b;

			// If both are files or both are folders, sort alphabetically
			if (nodeA.isFile === nodeB.isFile) {
				return nameA.localeCompare(nameB);
			}

			// If one is a file and one is a folder, put folder first
			return nodeA.isFile ? 1 : -1;
		});
	};

	// Component for a single tree node (file or folder)
	const TreeNode: React.FC<TreeNodeProps> = ({ name, node, level = 0 }) => {
		const [isOpen, setIsOpen] = useState<boolean>(false);
		const hasChildren = Object.keys(node.children).length > 0;

		const handleClick = () => {
			if (hasChildren) {
				setIsOpen(!isOpen);
			}
		};

		return (
			<div className='select-none'>
				<div
					className='flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800'
					style={{ paddingLeft: `${level * 20}px` }}
					onClick={handleClick}
					role='button'
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							handleClick();
						}
					}}
				>
					{hasChildren ? (
						<span className='mr-1 h-4 w-4'>
							{isOpen ? (
								<ChevronDown className='h-4 w-4' />
							) : (
								<ChevronRight className='h-4 w-4' />
							)}
						</span>
					) : (
						<span className='mr-1 h-4 w-4'></span>
					)}

					{node.isFile ? (
						<File className='mr-2 h-4 w-4' />
					) : (
						<Folder className='mr-2 h-4 w-4' />
					)}

					<span className='inline-flex w-full items-center justify-between'>
						<span className='text-sm'>{name}</span>
						{node.isFile && (
							<span className='font-light text-xs text-zinc-600 tracking-wide'>
								{renderBytes(node.size)}
							</span>
						)}
					</span>
				</div>

				{hasChildren && isOpen && (
					<div role='group'>
						{sortNodes(Object.entries(node.children)).map(
							([childName, childNode]) => (
								<TreeNode
									key={childName}
									name={childName}
									node={childNode}
									level={level + 1}
								/>
							)
						)}
					</div>
				)}
			</div>
		);
	};

	const treeData = createTreeStructure(files);

	return (
		<div
			className='w-full max-w-2xl rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-900'
			role='tree'
		>
			{sortNodes(Object.entries(treeData)).map(([name, node]) => (
				<TreeNode key={name} name={name} node={node} />
			))}
		</div>
	);
};
