<g:javascript src="jquery.cookie.js"
	base="${grailsApplication.config.grails.serverURL+'/js/jquery/'}"></g:javascript>
<g:javascript>
	
	$(document).ready(function(){
		$('#as_list').click(function(){
			$('#tagCloud').hide();
			$('#tagList').show();
			$(this).addClass('active');
			$('#as_cloud').removeClass('active');
			$.cookie("tags_view", "list");
		});
		
		$('#as_cloud').click(function(){
			$('#tagCloud').show();
			$('#tagList').hide();
			$(this).addClass('active');
			$('#as_list').removeClass('active');
			$.cookie("tags_view", "cloud");
		});
		
		if ($.cookie("tags_view") == "cloud") {
			$('#tagCloud').show();
			$('#tagList').hide();
			$('#as_cloud').addClass('active');
			$('#as_list').removeClass('active');
		}else{
			$('#tagList').show();
			$('#tagCloud').hide();
			$('#as_cloud').removeClass('active');
			$('#as_list').addClass('active');
		
		}
	});
</g:javascript>
<h5><i class="icon-tags"></i><g:message code="default.tags.title" default="Tags" /></h5>
<div class="tag-tools">
View as 
<span id="as_list" class="btn">List</span> 
<span id="as_cloud" class="btn active">Cloud</span>
</div>
<div id="tagCloud" class="tagsView">
	<obv:showTagsCloud/>
</div>
<div id="tagList" class="tagsView" style="display:none;">
	<obv:showTagsList model="['tags': tags]"/>
</div>	

