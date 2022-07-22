exports.getDate = function() {
    let today = new Date();
    return today.toLocaleDateString("en-US",{weekday:"long", month:"long",day:"numeric"});
}

exports.getDay =  function() {
    let today = new Date();
    return today.toLocaleDateString("en-US",{weekday:"long"});
}