function injectScript(fname,initFunc) 
{
	var h = document.getElementsByTagName("head").item(0);
	s = document.createElement("script");
	if(initFunc)
	{	
		if(browser.isIE)
			s.onreadystatechange = function()
			{
				if((this.readyState == 'loaded') || (this.readyState == 'complete')) 
					initFunc();
			}
		else
			s.onload = initFunc;
	}
	fname = fname + "?time=" + (new Date()).getTime();
	if(s.setAttribute)
		s.setAttribute('src', fname);
	else
		s.src = fname;
	s.type = "text/javascript";
	void (h.appendChild(s));
}

function injectCSS(fname) 
{
	var newSS=document.createElement('link'); 
	newSS.rel='stylesheet'; 
	newSS.href=fname; 
	var h = document.getElementsByTagName("head").item(0);
	void (h.appendChild(newSS));
}

function rPlugin( name )
{
	this.name = name;
	this.path = "plugins/"+name+"/";
}

rPlugin.prototype.loadLanguages = function(initFunc) 
{
	injectScript(this.path+"lang/"+GetActiveLanguage()+".js",initFunc);
}

rPlugin.prototype.loadCSS = function(name)
{
	injectCSS(this.path+name+".css");
}

rPlugin.prototype.loadMainCSS = function()
{
	this.loadCSS(this.name);
}

rPlugin.prototype.attachPageToOptions = function(dlg,name)
{
	$$("stg_c").insertBefore(dlg,$$("st_ao"));
	var el = $$("mnu_st_ao");
	var ul = null;
	var li = null;
	while(el)
	{
		el = el.parentNode;
		if(el.tagName)
		{
			var s = el.tagName.toLowerCase();
			if(s=="ul")
			{
				ul = el;
				break;
			}
			else
			if(s=="li")
				li = el;
		}
	}
	if(ul && li)
	{
		el = document.createElement("LI");
		el.innerHTML = "<a id='mnu_"+dlg.id+"' href=\"javascript:ch_mnu('"+dlg.id+"');\">"+name+"</a>";
		ul.insertBefore(el,li);
	}
}

function getCSSRule( selectorText )
{
	function getRulesArray(i)
	{
		var crossrule = null;
		try {
		if(document.styleSheets[i].cssRules)
			crossrule=document.styleSheets[i].cssRules;
		else 
			if(document.styleSheets[i].rules)
				crossrule=document.styleSheets[i].rules;
		} catch(e) {}
		return(crossrule);
	}

	selectorText = selectorText.toLowerCase()
	var ret = null;
	for( var j=document.styleSheets.length-1; j>=0; j-- )
	{
		var rules = getRulesArray(j);
		for( var i=0; rules && i<rules.length; i++ )
		{
			if(rules[i].selectorText && rules[i].selectorText.toLowerCase()==selectorText)
			{
				ret = rules[i];
				break;
			}			
		}
	}
	return(ret);
}