import React from 'react';

export default function StorageOrderView(props){

	const html = props.html ? props.html : "<div />";
	const css = props.css ? props.css : '<style />';

	const isLoading = props.isLoading ? props.isLoading : false;

	let res = isLoading ? [] : [
			<style dangerouslySetInnerHTML={{ __html: css }} />,
			<div dangerouslySetInnerHTML={{__html: html }} />
	]

	return (
		<div>
			{res}
		</div>
	);
};

