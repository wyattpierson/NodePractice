var userListData = [];
$(document).ready(function(){
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
	$('#btnAddUser').on('click', addUser);
	populateTable();
});

function populateTable(){
	var tableContent = '';
	$.getJSON('users/userlist', function(data){
		userListData = data;
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>'; 
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '</tr>';
		});

		$('#userList table tbody').html(tableContent);
	});
};

function showUserInfo(event){
	event.preventDefault();
	var thisUsername = $(this).attr('rel');
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUsername);
	var thisUserObject = userListData[arrayPosition];

	var thisUserObject = userListData[arrayPosition];

	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
};

function deleteUser(event){
	event.preventDefault();
	var confirmation = confirm('You sure??? This information may be SUPER important and will be gone forever');
	if (confirmation){
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response){
			if (response.msg !== ''){
				alert('Bad news: ' + response.msg);
			}
			populateTable();
		});
	}
	else{
		return false;
	}
};

function addUser(event){
	event.preventDefault();
	//Pretty lame error handling. If a field is empty we have an error
	var isError = false;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === ''){ 
			isError = true; 
		}
	});
	if (!isError){
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		}

		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response){
			if (response.msg === ''){
				populateTable();
				$('#addUser fieldset input').val('');
			}
			else{
				alert("ERROR!!!! This is an alert so you know it is bad: " + response.msg);
			}
		});
	}
	else{
		//Alerts are the worst, sorry for being lazy
		alert('Please fill in all fields. Also sorry for the alert. They are the worst. This is lazy');
		return false;
	}
};
