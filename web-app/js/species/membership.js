/**
 * 
 */

function joinAction(me, joinUsUrl) {
	if(me.hasClass('disabled')) return false;
	
	$.ajax({
    	url: joinUsUrl,
        method: "POST",
        dataType: "json",
        success: function(data) {
        	if(data.statusComplete) {
        		$(me).html(data.shortMsg).removeClass("btn-success").addClass("disabled");
        		$(".alertMsg").removeClass('alert-error').addClass('alert-success').html(data.msg+". Please press <a href='#' onclick='document.location.reload(true);'>reload</a> to load new changes.");
        		//document.location.reload(true);
        	} else {
        		$(me).html(data.shortMsg).removeClass("btn-success").addClass("disabled");
        		$(".alertMsg").removeClass('alert alert-success').addClass('alert alert-error').html(data.msg);
        		//reloadActionsHeader();
        	}
        	
        }, error: function(xhr, status, error) {
			handleError(xhr, status, error, this.success, function() {
            	var msg = $.parseJSON(xhr.responseText);
                $(".alertMsg").html(msg.msg).removeClass('alert-success').addClass('alert-error');
			});
        }
	});
	return false;
}

function requestMembershipAction(me, requestMembershipUrl) {
	if(me.hasClass('disabled')) return false;
	$.ajax({
    	url: requestMembershipUrl,
        method: "POST",
        dataType: "json",
        success: function(data) {
        	if(data.statusComplete) {
        		$(me).html(data.shortMsg).removeClass("btn-success").addClass("disabled");
        		$(".alertMsg").removeClass('alert alert-error').addClass('alert alert-success').html(data.msg);
        		//document.location.reload(true);
        	} else {
        		$(me).html(data.shortMsg).removeClass("btn-success").addClass("disabled");
        		$(".alertMsg").removeClass('alert alert-success').addClass('alert alert-error').html(data.msg);
        		//reloadActionsHeader();
        	}
        }, error: function(xhr, status, error) {
			handleError(xhr, status, error, this.success, function() {
            	var msg = $.parseJSON(xhr.responseText);
                $(".alertMsg").html(msg.msg).removeClass('alert alert-success').addClass('alert alert-error');
			});
        }
	});
	return false;
}

function membership_actions() {
	$(".joinUs").bind('click', function() {
		joinAction($(this), window.joinUsUrl);
	})
	
	$(".requestMembership").bind('click', function() {
		requestMembershipAction($(this), window.requestMembershipUrl);
	})
	
	$(".leaveUs").bind('click', function() {
		if($(this).hasClass('disabled')) return false;
		$('#leaveUsModalDialog').modal('show');
		return false;
	});
	
	$("#leave").click(function() {
		if($(this).hasClass('disabled')) return false;
		var dataGroupId = $(this).attr('data-group-id');
		var leaveUrl = $(this).attr('data-leaveUrl');
		
		var me = $(".leaveUs[data-group-id="+dataGroupId+"]");
		
		$.ajax({
        	url: leaveUrl,
            method: "POST",
            dataType: "json",
            data:{'id':dataGroupId},
            success: function(data) {
            	if(data.statusComplete) {
            		$("me").html(data.shortMsg).removeClass("btn-info").addClass("disabled");
            		$(".alertMsg").removeClass('alert alert-error').addClass('alert alert-success').html(data.msg);
            		//reloadMembers();
            	} else {
            		$("me").html(data.shortMsg).removeClass("btn-success").addClass("disabled");
            		$(".alertMsg").removeClass('alert alert-success').addClass('alert alert-error').html(data.msg);
            	}
            	$('#leaveUsModalDialog').modal('hide');
            	document.location.reload(true)
            }, error: function(xhr, status, error) {
				handleError(xhr, status, error, this.success, function() {
                	var msg = $.parseJSON(xhr.responseText);
                    $(".alertMsg").html(msg.msg).removeClass('alert-success').addClass('alert-error');
				});
            }
		});
	})
	
	
	$("#invite").click(function(){
		$('#memberUserIds').val(members_autofillUsersComp[0].getEmailAndIdsList().join(","));
		$('#inviteMembersForm').ajaxSubmit({ 
			url:window.inviteMembersFormUrl,
			dataType: 'json', 
			clearForm: true,
			resetForm: true,
			type: 'POST',
			
			success: function(data, statusText, xhr, form) {
				if(data.statusComplete) {
					$('#inviteMembersDialog').modal('hide');
					$(".alertMsg").removeClass('alert alert-error').addClass('alert alert-success').html(data.msg);
				} else {
					$("#invite_memberMsg").removeClass('alert alert-error').addClass('alert alert-success').html(data.msg);
				}				
			}, error:function (xhr, ajaxOptions, thrownError){
					//successHandler is used when ajax login succedes
	            	var successHandler = this.success;
	            	handleError(xhr, ajaxOptions, thrownError, successHandler, function() {
						var response = $.parseJSON(xhr.responseText);
						
					});
           } 
     	});	
	});
     	
   	$('#inviteMembersDialog').modal({
		"show" : false,
		"backdrop" : "static"
	});
	$('#leaveUsModalDialog').modal({
		"show" : false,
		"backdrop" : "static"
	});
		
	$('#inviteMembers').click(function(){
			$.ajax({ 
	         	url:window.isLoggedInUrl,
				success: function(data, statusText, xhr, form) {
					if(data === "true"){
						$('#memberUserIds').val('');
						$('#inviteMembersDialog').modal('show');
						return false;
					}else{
						window.location.href = window.loginUrl+"?spring-security-redirect="+window.location.href;
					}
	            },
	            error:function (xhr, ajaxOptions, thrownError){
	            	return false;
				} 
	     	});
	});
}

var members_autofillUsersComp;

//this is called from domain/_headerTemplate
function init_group_header() {
	
	members_autofillUsersComp = $("#userAndEmailList_"+window.members_autofillUsersId).autofillUsers({
		usersUrl : window.userTermsUrl
	});
}

/*
 * needs to be called only once for a page
 * as calling this function multiple times would result in
 * multiple bindings of following event handlers
 */
function init_header() {
	$("#allGroups").click(function(){
		
			$("#myGroupsInfo").slideUp('fast');
			$("#allGroupsInfo").slideDown('slow');
		
		return false;
	});
	$("#myGroups").click(function(){
		
			$("#allGroupsInfo").slideUp('fast');
			$("#myGroupsInfo").slideDown('slow');
		
		return false;
	});
	
	$('body').on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function (e) {
		  $(this).parent().nextAll($(this).attr("data-target")).collapse('toggle')
	});
		
//	$(".close").click(function(){
//		$(this).parent().slideUp('fast');
//		return false;
//	})
	$(".active .submenu").show();
	
	init_group_header();

	membership_actions();
	
}

function last_actions() {
	$(".ellipsis.multiline").trunk8({
		lines:2,		
	});
	
	$(".ellipsis:not(.multiline)").trunk8();
	
	$('.collapse').on({
	    shown: function(){
	        $(this).css('overflow','visible');
	    },
	    hide: function(){
	        $(this).css('overflow','hidden');
	    }
	});
	
	$('.linktext').linkify();   
}