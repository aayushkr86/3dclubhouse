/**
 * Created by anooj on 11/05/17.
 */
var tesseract = require('node-tesseract');

// Recognize text of any language in any format
tesseract.process(__dirname + '/test_hand.gif',function(err, text) {
    if(err) {
        console.error(err);
    } else {
        console.log(text);
    }
});
