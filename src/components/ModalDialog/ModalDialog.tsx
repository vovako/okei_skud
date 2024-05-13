import { ReactElement } from 'react';
import './modal-dialog.scss';
import crossImg from '@images/cross.svg'


interface IModalDialog {
	id: string,
	children: ReactElement
}
function ModalDialog({ id, children }: IModalDialog) {

	function onClickCloseBtn(evt: MouseEvent) {
		const target = evt.target as HTMLElement
		const dialog = target.closest('.modal-dialog') as HTMLDialogElement
		dialog.close()
	}

	return (
		<dialog className="modal-dialog" id={id}>
			<div className="modal-dialog__content">
				<button onClick={onClickCloseBtn as any} className="modal-dialog__close-btn">
					<img src={crossImg} alt="" />
				</button>
				{children}
			</div>
		</dialog>
	);
}

export function ErrorModal() {
	return (
		<ModalDialog id={'error-modal'}>
			<div className="modal-dialog__text"></div>
		</ModalDialog>
	)
}