var bodyParser = require('body-parser')
const express = require('express');
const app = express();
var ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort('COM5');
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const { url } = require('./config/database.js');
mongoose.connect(url, {
	useMongoClient: true
});

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

require('./app/routes.js')(app);

app.use(express.static(path.join(__dirname, 'public')));


parser.on('data', function (data) {
	io.emit('nuevo uid',data);
});

server.listen(app.get('port'), () => {
	console.log('server on port ', app.get('port'));
});

