import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

const OrdersSendResultDialog =(props) => {

	const isOpen = props.result ? props.result.showMessage : false;
	const [open, setOpen] = React.useState(isOpen);

	const handleClose = ()=>{
		if (props.onClose) {
			props.onClose();
		}
		setOpen(false);
	}

	const isError = ()=>{
		return parseInt(props.result ? props.result.result : 0) < 0;
	}

	const color = isError ? 'error' : 'primary';

	React.useEffect(()=>{
		if(props.result){
			setOpen(props.result.showMessage);
		}
	}, [open, props.result, setOpen]);

	const content = () =>{
		if(isError()){
			return props.result ? props.result.err : 'Какая-то ошибка';
		} else {
			return props.result ? props.result.message : 'Ok';
		}
	}

	return (
		<Dialog maxWidth={'xs'} open={open} onClose={handleClose} >
			<DialogTitle color={color}>
				{isError() ? 'Ошибка...' : 'Отправлено...'}
			</DialogTitle>
			<DialogContent>
				{content()}
			</DialogContent>
			<DialogActions>
				<Button size='small' onClick={handleClose} variant='contained' color={color}>
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default OrdersSendResultDialog;