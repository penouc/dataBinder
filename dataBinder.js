function DataBinder(id){

	var pubSub = {
		handlers : {}
	};

	pubSub.on = function(eventType,handle){
		var list = this.handlers[eventType] || (this.handlers[eventType] = []);
		list.push(handle);
		return this;
	}

	pubSub.emit = function(eventType){
		var handleArgs = Array.prototype.slice.call(arguments,1);
		var list = this.handlers[eventType];
		for(var i = 0; i<list.length; i++){
			list[i].apply(this,handleArgs);
		}
		return this;
	}

	var attrName = "data-bind-" + id;
	var mess = id + ": change";

	function changeHandler(e){
		var target = e.target || e.srcElement,
			prop_value = target.getAttribute(attrName);

		if(prop_value || prop_value != ''){
			pubSub.emit(mess,prop_value,target.value)
		}

	}

	if(document.addEventListener){
		document.addEventListener('keyup',changeHandler,false);
	}else{
		document.attachEvent('keyup',changeHandler);
	}

	pubSub.on(mess,function(prop_value,new_value){
		var eles = document.querySelectorAll("[" + attrName + "=" + prop_value + "]");
			_tagName;

		for(var i = 0; i<eles.length; i++){
			var _tagName = eles[i].tagName.toLowerCase();

			if(_tagName === "input" || _tagName === "textarea" || _tagName === "select"){
				eles[i].value = new_value;
			}else{
				eles[i].innerHTML = new_value;
			}
		}
	})



	return pubSub;

}

function User(uid){

	var binder = new DataBinder(uid);

	var user = {
		attributes : {},

		set : function(attr_name,val){
			this.attributes[attr_name] = val;
			binder.emit(uid+": change",attr_name,val,this);
		},

		get : function(attr_name){
			return this.attributes[attr_name];
		},

		_binder : binder

	}

	binder.on(uid + ": change",function(attr_name,val,initiator){
		if(initiator !== user){
			user.set(attr_name,val);
		}
	})

	return user
}

var user = new User('kk');
user.set('name',1111)
