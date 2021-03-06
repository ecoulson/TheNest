import React, { Component } from 'react';
import { AppContext } from '../../AppContext';
import FormData from './FormData';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import './form.css';
// Require Editor JS files.
import * as $ from 'jquery';
import "froala-editor/js/froala_editor.pkgd.min.js";

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Require Font Awesome.
import 'font-awesome/css/font-awesome.css';

import FroalaEditor from 'react-froala-wysiwyg';

window["$"] = $; window["jQuery"] = $;

const options = {
	grades: [
		{value: 12, label: "12"},
		{value: 11, label: "11"},
		{value: 10, label: "10"},
		{value: 9, label: "9"},
		{value: 8, label: "8"},
		{value: 7, label: "7"},
		{value: 6, label: "6"},
		{value: 5, label: "5"},
	],
	type: [
		{value: "sports", label: "Sports"},
		{value: "art", label: "Art"},
		{value: "theatre", label: "Theatre"},
		{value: "band", label: "Band"},
		{value: "general", label: "General"},
		{value: "club", label: "Club"},
		{value: "asb", label:"ASB"}
	]
};

const multiStyle = {
	container: (base, props) => {
		if (props.selectProps.disabled) {
			return {
				...base,
				width: "40%",
				margin: "15px 5%",
				borderRadius: "none",
				border: "1px solid black",
				backgroundColor: "gray",
				boxShadow: "none",
				maxWidth: "250px"
			};
		} else {
			return {
				...base,
				width: "40%",
				margin: "15px 5%",
				borderRadius: "none",
				border: "none",
				"&:focus": {
					border: "none",
					outline: "none",
				},
				boxShadow: "none",
				cursor: "not-allowed",
				maxWidth: "250px"
			};
		}
	},
	control: (base,props) => {
		if (props.selectProps.disabled) {
			return {
				...base,
				border: "3px solid black",
				backgroundColor: "gray",
				borderRadius: "none",
				overflow: "hidden",
				height: "50px",
				boxShadow: "none",
				cursor: "not-allowed"
			};
		} else {
			return {
				...base,
				border: "3px solid black",
				backgroundColor: "rgb(234, 234, 234)",
				borderRadius: "none",
				"&:hover": {
					border: "3px solid #efdd8d",
					backgroundColor: "#356a20",
					color: "white"
				},
				overflow: "hidden",
				height: "50px",
				boxShadow: "none"
			}
		}
	},
	valueContainer: (base) => {
		return {
			...base,
			display: "flex",
			overflowY: "scroll",
			height: "inherit",
			backgroundColor: "transparent",
			border: "none",
			boxShadow: "none",
		}
	},
	input: (base) => {
		return {
			...base,
			backgroundColor: "transparent",
			border: "none",
			boxShadow: "none",
		}
	},
	multiValue: (base) => ({
		...base,
		backgroundColor: "#356a20",
		borderRadius: "none",
	}),
	singleValue: (base) => ({
		...base,
		color: "inherit",
		backgroundColor: "transparent",
		boxShadow: "none",
	}),
	placeholder: (base) => ({
		...base,
		color: "inherit",
		backgroundColor: "transparent",
		boxShadow: "none",
	}),
	multiValueLabel: (base, state) => ({
		...base,
		color: "white",
		backgroundColor: state.isFocused ? "red" : "transparent",
	}),
	multiValueRemove: (base) => ({
		...base,
		"&:hover": {
			color: "white",
			backgroundColor: "red",
			cursor: "pointer"
		},
		borderRadius: "none",
		backgroundColor: "transparent",
		boxShadow: "none",
	}),
	menu: (base) => ({
		...base,
		position: "relative",
		border: "none",
		backgroundColor: "none",
		margin: "0",
	}),
	option: (base, state) => ({
		...base,
		color: state.isFocused ? "white" : "black",
		backgroundColor: state.isFocused ? "#356a20" : "rgb(234, 234, 234)",
		cursor: state.isFocused ? "pointer" : "default"
	}),
	indicatorsContainer: (base) => ({
		...base,
		backgroundColor: "transparent",
		boxShadow: "none",
		border: "none",
	}),
	clearIndicator: (base) => ({
		backgroundColor: "transparent",
		boxShadow: "none",
	}),
	dropdownIndicator: (base) => ({
		...base,
		color: "black",
		"&:hover": {
			color: "white"
		}
	}),
	menuList: (base) => ({
		...base,
		border: "3px solid black",
		width: "100%",
		margin: "0",
		backgroundColor: "rgb(234, 234, 234)",
		top: "0",
		left: "0",
		position: "absolute"
	})
}

export default class Form extends Component {
	constructor(props) {
		super();
		this.state = {
			title: "",
			desc: "",
			author: JSON.parse(getCookie('user')).username,
			grades: [],
			type: "",
		}
		this.handleTitleInput = this.handleTitleInput.bind(this);
		this.handleSubmitClick = this.handleSubmitClick.bind(this);
		this.handleSubmittedForm = this.handleSubmittedForm.bind(this);	
		this.onGradeChange = this.onGradeChange.bind(this);
		this.onTypeChange = this.onTypeChange.bind(this);
		this.saveHandler = this.saveHandler.bind(this);
	}

	handleTitleInput(e) {
		this.setState({
			title: e.target.value
		});
	} 

	handleSubmitClick() {
		let formData = new FormData(this.state);
		let validationResult = formData.validate();
		if (validationResult.isValid) {
			this.handleSubmittedForm(formData);
		} else {
			this.showStatus({
				message: validationResult.message,
				color: "red",
				fontColor: "black",
				duration: 3
			})
		}
	}

	handleSubmittedForm(formData) {
		fetch(`/api/announcements`, {
			method: "POST",
			credentials: 'include',
			body: formData.serialize(),
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
		}).then((res) => {
			return res.json();
		}).then((payload) => {
			this.showSubmittedStatus(payload.success, this.showStatus);
			this.setState({
				title: "",
				desc: "",
				grades: [],
				type: ""
			});
		});
	}

	showSubmittedStatus(success) {
		if (success) {
			this.showStatus({
				message: "Successfully Submitted Announcement For Approval",
				color: "#356a20",
				fontColor: "white",
				duration: 3
			});
			this.props.getUnapproved();
		} else {
			this.showStatus({
				message: "Failed To Submit Announcement For Approval",
				color: "red",
				fontColor: "black",
				duration: 3
			});
		}
	}

	onGradeChange(grades) {
		this.setState({
			grades: grades
		});
	}

	onTypeChange(type) {
		this.setState({
			type: type
		});
	}

	saveHandler(text) {
		this.setState({
			desc: text
		})
	}

	render() {
		return (
			<div className="form">
				<h1>Create Announcement</h1>
				<AppContext.Consumer>
					{context => {
						this.showStatus = context.showStatus
					}}
				</AppContext.Consumer>
				<input disabled={this.props.disabled} value={this.state.title} onChange={this.handleTitleInput} placeholder="Title..." className="form-title"/>
				<br/>
				<FroalaEditor
 					tag='textarea'
					model={this.state.desc}
					config={{
						placeholder: "Write your anouncement!",
						toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertFile', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'getPDF', 'spellChecker', 'help', '|', 'undo', 'redo'],
						toolbarButtonsSM: ['fullscreen', 'bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'insertLink', 'insertImage', 'insertTable', 'undo', 'redo'],
						toolbarButtonsXS: ['bold', 'italic', 'fontFamily', 'fontSize', 'undo', 'redo'],
						quickInsertButtons: ['image', 'ul', 'ol', 'hr'],
						fileUploadURL: '/api/editor/files',
						spellcheck: true,
						imageInsertButtons: ['imageByURL', 'imageUpload'],
						imageUploadURL: '/api/editor/images',
						imageUploadParam: 'image',
						imageUploadParams: {
							url: window.location.origin
						},
						imageUploadMethod: 'POST',
					}}
					onModelChange={this.saveHandler}
				/>
				<br/>
				<div style={{display: "flex", justifyContent: "center"}}>
					<Select
						disabled={this.props.disabled}
						styles={multiStyle}
						options={options["grades"]} 
						isMulti={true} 
						components={makeAnimated()}
						placeholder="Grades..."
						onChange={this.onGradeChange}
						value={this.state.grades}
						/>
					<Select 
						disabled={this.props.disabled}
						styles={multiStyle} 
						options={options["type"]} 
						onChange={this.onTypeChange}
						value={this.state.type}
						placeholder="Type..."
						/>
				</div>
				<input disabled={this.props.disabled} onClick={this.handleSubmitClick} className="form-create" type="button" value="Submit"/>
			</div>
		)
	}
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}