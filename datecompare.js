function compareDate(date){
	var now = new Date();

	if(now.getTime() - date.getTime()-  >= 300000){
		// return true: it has been 5minutes or longer
			return true;
	}else{
		//return false: no it has not
		return false;
	}

}