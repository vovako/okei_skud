import React from 'react';
import './modal-dialog.scss';
import crossImg from '/src/assets/cross.svg'

function ModalDialog({ id, children }) {

	function onClickCloseBtn(evt) {
		evt.target.closest('.modal-dialog').close()
	}

	return (
		<dialog className="modal-dialog" id={id}>
			<div className="modal-dialog__content">
				<button onClick={onClickCloseBtn} className="modal-dialog__close-btn">
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