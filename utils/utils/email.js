var nodemailer = require('nodemailer');

var Email = function(){}

Email.prototype.sendEmail = function(email, body) {
    var transporter = nodemailer.createTransport({
        service: 'Yahoo',
        auth: {
            user: process.env.email,
            pass: process.env.password
        }
    });
    var mailOptions = {
        from: process.env.email, 
        to: email,
        subject: 'WPT : Page Size notification',
        text : body,
        html: body 
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}

Email.prototype.formatEmail = function(tests, maxSize){
    var header = "<!DOCTYPE html><html><head></head><body><h2>Webpagetest Wrapper</h2><br><p>The following URLs have a page size greater than " + maxSize + "kB!</p><br/><br/>"
    var tableRows = "";
    tests.forEach(function(test, i){
        if(test.site_address)
        {
            tableRows += "<tr><td style='border : 1px solid black'><a href='" + test.site_address + "'>" + test.site_address + "</a></td><td style='border : 1px solid black'>" + test.fv_bytes_in/1000 + "</td><td style='border : 1px solid black'>" + test.sv_bytes_in/1000 + "</td></tr>";
        }
    });
    var table = "<table><thead><tr><td style='border : 1px solid black'>URL</td><td style='border : 1px solid black'>First View Page Size (kB)</td><td style='border : 1px solid black'>Repeat View Page Size (kB)</td></tr></thead><tbody>" + tableRows + "</tbody></table></body></html>";
    return header + table;
}

module.exports = new Email();
