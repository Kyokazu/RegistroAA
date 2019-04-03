const usuario = require('./models/usuario');
const asistencia = require('./models/asistencia');
const asesoria = require('./models/asesoria');


module.exports = (app) => {

	app.get('/', (req, res) => {
		res.render('index', {
			message: ""
		});
	});

	app.post('/carnet', (req, res) => {

		usuario.findOne({ 'serialCarnet': req.body.serial }, (err, user) => {
			if (err) { }
			if (!user) {
				res.render('estudiante.ejs', {
					serial: req.body.serial,
					mess: "Usted no se encuentra registrado, por favor, llene el siguiente formulario",
					message: ""
				});
			} else {
				if (user.tipo === 'estudiante') {
					res.render('registrarAsesoria.ejs', {
						datos: user,
						message: "",
					});
				} if (user.tipo === 'admin') {
					res.render('admin.ejs', {
						datos: user,
						message: ""
					});
				}
				if (user.tipo === 'amigo') {
					res.render('amigos.ejs', {
						datos: user
					});
				}
			}
		});
	});

	app.post('/listarAmigos', (req, res) => {
		usuario.find({ 'tipo': 'amigo' }, (err, amigos) => {
			if (err) { }
			if (!amigos) {
				res.render('admin.ejs', {
					message: "No existe ningún amigo académico registrado"
				});
			} else {
				res.render('administrarUsuarios.ejs', {
					datos2: amigos,
					serial: req.body.serial
				});
			}
		});
	});

	app.post('/listarEstudiantes', (req, res) => {
		usuario.find({ 'tipo': 'estudiante' }, (err, estudiante) => {
			if (err) { }
			if (!estudiante) {
				res.render('admin.ejs', {
					message: "No existe ningún estudiante"
				});
			} else {
				res.render('administrarUsuarios.ejs', {
					datos2: estudiante,
					serial: req.body.serial
				});
			}
		});
	});

	app.post('/registrarAmigoAcademico', (req, res) => {
		usuario.findOne({ 'serialCarnet': req.body.serial }, function (err, admin) {
			res.render('registrarAmigoAcademico.ejs', {
				message: "",
				datos: admin
			});
		});
	});

	app.post('/registrarAmigo', (req, res) => {
		usuario.findOne({ 'serialCarnet': req.body.serialAdmin }, function (err, admin) {
			usuario.findOne({ 'serialCarnet': req.body.serial }, function (err, info) {
				if (err) { }
				if (info) {
					res.render('registrarAmigoAcademico.ejs', {
						datos: admin,
						message: "Ese carnet ya se encuentra registrado",
						mess: ""
					});
				} else {
					var newUsuario = new usuario();
					newUsuario.serialCarnet = req.body.serial;
					newUsuario.nombre = req.body.nombre,
						newUsuario.codigo = req.body.codigo,
						newUsuario.correo = req.body.correo,
						newUsuario.tipo = "amigo",
						newUsuario.save(function (err) {
							if (err) { throw err; }
							res.render('admin.ejs', {
								datos: admin,
								message: "Amigo Académico registrado correctamente",
								mess: ""
							});
						});
				}
			});
		});
	});

	app.get('/login', (req, res) => {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.get('/asistencia', (req, res) => {
		res.render('asistencia.ejs', {
			message: ""
		});
	});

	app.post('/consultarAsistencia', (req, res) => {
		res.render('asistencia.ejs', {
			message: "",
			serial: req.body.serial
		});
	});

	app.post('/consultarAsistenciaAmigo', (req, res) => {
		usuario.findOne({ 'codigo': req.body.codigo }, (err, amigo) => {
			asistencia.find({ 'serialCarnet': amigo.serialCarnet }, (err, asist) => {
				if (err) { }
				else {
					if (amigo.tipo !== 'amigo') {
						res.render('asistencia.ejs', {
							message: "Ese carnet no se encuentra registrado como Amigo Académico",
							serial: req.body.serialAdmin
						});
					}
					else {
						res.render('listaAsistencias.ejs', {
							datos: asist,
							datos2: amigo,
							serial: req.body.serialAdmin
						});
					}
				}
			});
		});
	});

	app.get('/estudiante', (req, res) => {
		res.render('estudiante.ejs', {
			message: ""
		});
	});


	app.post('/listarAsesorias', (req, res) => {
		res.render('AsesoriasFiltradas.ejs', {
			message: "",
			serial: req.body.serial
		});
	});

	app.post('/listarAsesoriasFiltradas', (req, res) => {
		var fechaIni = new Date(req.body.fechaInicial);
		var fechaFin = new Date(req.body.fechaFinal);
		var fechaI = (fechaIni.getFullYear() + '' + ('0' + (fechaIni.getMonth() + 1)).slice(-2) + '' + ('0' + fechaIni.getDate()).slice(-2));
		var fechaF = (fechaFin.getFullYear() + '' + ('0' + (fechaFin.getMonth() + 1)).slice(-2) + '' + ('0' + fechaFin.getDate()).slice(-2));

		asesoria.find({
			'serialCarnetAmigo': req.body.serialAmigo, 'fechaNumero': {
				$gt: fechaI,
				$lt: fechaF
			}
		}, function (err, info) {

			res.render('listarAsesorias.ejs', {
				datos: info
			});
		});
	});

	app.post('/registrarEstudiante', (req, res) => {

		usuario.findOne({ 'serialCarnet': req.body.serial }, function (err, info) {
			if (err) { }
			if (info) {
				res.render('estudiante.ejs', {
					message: "Ese carnet ya se encuentra registrado",
					mess: ""
				});
			} else {
				var newUsuario = new usuario();
				newUsuario.serialCarnet = req.body.serial;
				newUsuario.nombre = req.body.nombre,
					newUsuario.codigo = req.body.codigo,
					newUsuario.correo = req.body.correo,
					newUsuario.tipo = "estudiante",
					newUsuario.save(function (err) {
						if (err) { throw err; }
						res.render('index.ejs', {
							message: "Estudiante registrado correctamente",
							mess: ""
						});
					});
			}
		});
	});

	app.get('/asesoria', (req, res) => {
		res.render('asesoria.ejs', {
			message: ""
		});
	});

	app.post('/registrarAsesoria', (req, res) => {
		var MyDate = new Date();
		var MyDateString;
		var fechaNumero = (MyDate.getFullYear() + '' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '' + ('0' + MyDate.getDate()).slice(-2));
		MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
		var fechaIso = new Date(MyDateString);
		usuario.findOne({ 'serialCarnet': req.body.serialEstudiante }, function (err, estudiante) {
			if (err) { }
			else {
				usuario.findOne({ 'serialCarnet': req.body.serialAmigo }, function (err, amigo) {
					if (err) { }
					if (!amigo) {
						res.render('registrarAsesoria.ejs', {
							message: "Ese carnet NO pertenece a ningún Amigo Académico",
							datos: estudiante
						});
					} else {
						if (amigo.tipo !== 'amigo') {
							res.render('registrarAsesoria.ejs', {
								message: "Ese carnet NO pertenece a ningún Amigo Académico",
								datos: estudiante
							});
						} else {
							var newAsesoria = new asesoria();
							newAsesoria.serialCarnetAmigo = amigo.serialCarnet;
							newAsesoria.serialCarnetEstudiante = estudiante.serialCarnet,
								newAsesoria.nombreAmigo = amigo.nombre,
								newAsesoria.nombreEstudiante = estudiante.nombre,
								newAsesoria.materia = req.body.materia,
								newAsesoria.tema = req.body.tema,
								newAsesoria.fecha = MyDateString,
								newAsesoria.fechaNumero = fechaNumero,
								newAsesoria.save(function (err) {
									if (err) { throw err; }
									res.render('index.ejs', {
										message: "Asesoría registrada correctamente"
									});
								});
						}
					}
				});
			}
		});
	});


	app.post('/registrarIngreso', (req, res) => {
		var MyDate = new Date();
		var MyDateString;
		var hora = ('0' + MyDate.getHours()).slice(-2);
		var minutos = ('0' + MyDate.getMinutes()).slice(-2);
		MyDateString = MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-' + ('0' + MyDate.getDate()).slice(-2);
		var fechaIso = new Date(MyDateString);
		var fechaNumero = (MyDate.getFullYear() + '' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '' + ('0' + MyDate.getDate()).slice(-2));
		console.log(fechaIso);
		usuario.findOne({ 'serialCarnet': req.body.serial }, function (err, data) {
			if (err) { }
			if (!data) {
				res.render('noRegistrado.ejs');
			} else {
				if (data.tipo === 'admin') {
					usuario.find({}, function (err, users) {
						res.render('administrador.ejs', {
							datos: data,
							datos2: users
						});
					});
				} if (data.tipo === 'amigo') {
					asistencia.find({ 'serialCarnet': req.body.serial }, function (err, asist) {
						if (err) { }
						if (asist.length === 0) {
							var newAsistencia = new asistencia();
							newAsistencia.serialCarnet = req.body.serial,
								newAsistencia.fecha = MyDateString,
								newAsistencia.fechaNumero = fechaNumero,
								newAsistencia.horaEntrada = hora,
								newAsistencia.minutoEntrada = minutos,
								newAsistencia.horaSalida = '0',
								newAsistencia.minutoSalida = '0',
								newAsistencia.save(function (err) {
									if (err) { throw err; }
								});
							res.render('registroExitoso.ejs', {
								message: "Se ha registrado la entrada.",
								amigo: data,
								horaE: hora,
								minutoE: minutos,
								horaS: '',
								minutoS: ''
							});
						} else {
							for (let i = 0; i < asist.length; i++) {
								if (asist[i].horaSalida === '0') {
									asistencia.findOneAndUpdate({ 'serialCarnet': req.body.serial, '_id': asist[i]._id },
										{
											"$set": { 'horaSalida': hora, 'minutoSalida': minutos }
										}).exec(function (err, book) {
											if (err) {
												console.log(err);
												res.status(500).send(err);
											} else {
												res.render('registroExitoso.ejs', {
													message: "Se ha registrado la salida.",
													amigo: data,
													horaE: asist[i].horaEntrada,
													minutoE: asist[i].minutoEntrada,
													horaS: hora,
													minutoS: minutos
												});
											}
										});
								}

								if (asist[i].horaSalida !== '0' && ((i == ((asist.length) - 1)))) {
									var newAsistencia = new asistencia();
									newAsistencia.serialCarnet = req.body.serial,
										newAsistencia.fecha = MyDateString,
										newAsistencia.fechaNumero = fechaNumero,
										newAsistencia.horaEntrada = hora,
										newAsistencia.minutoEntrada = minutos,
										newAsistencia.horaSalida = '0',
										newAsistencia.minutoSalida = '0',
										newAsistencia.save(function (err) {
											if (err) { throw err; }
										});
									res.render('registroExitoso.ejs', {
										message: "Se ha registrado la entrada.",
										amigo: data,
										horaE: hora,
										minutoE: minutos,
										horaS: '0',
										minutoS: '0'
									});
								}
							}
						}
					});

				} if (data.tipo === 'estudiante') {
					res.render('asistencia.ejs', {
						message: "Tipo de usuario NO válido."
					});
				};
			}
		});
	});

	app.post('/editarUsuarioForm', (req, res) => {
		usuario.findOne({ 'serialCarnet': req.body.serialCarnet }, (req, user) => {
			res.render('edicionUsuario.ejs', {
				message: "",
				serial: req.body.serialAdmin,
				datos2: user
			});
		});
	});

	app.post('/editarUsuario', (req, res) => {
		usuario.findOne({ 'serialCarnet': req.body.serialCarnet }, (req, user) => {
			if (err) { }
			if (user) {
				res.render('edicionUsuario.ejs', {
					datos: user,
					serial: req.body.serialAdmin,
					message: "Este código ya está registrado."
				});
			} else {
				usuario.findOneAndUpdate({ 'serialCarnet': req.body.serialCarnet },
					{
						"$set": { 'nombre': req.body.nombre, 'codigo': req.body.codigo, 'correo': req.body.correo }
					}).exec(function (err, book) {
						if (err) {
							console.log(err);
							res.status(500).send(err);
						} else {
							usuario.findOne({ 'serialCarnet': req.body.serialAdmin }, (req, admin) => {
								res.render('admin.ejs', {
									message: "Usuario Actualizado Correctamente",
									datos: admin
								});
							});
						}
					});
			}
		});
	});

	app.post('/eliminarUsuario', (req, res) => {
		usuario.findOneAndRemove({ 'serialCarnet': req.body.serialCarnet }).exec(function (err, book) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
			} else {
				usuario.findOne({ 'serialCarnet': req.body.serialAdmin }, (req, admin) => {
					res.render('admin.ejs', {
						message: "Usuario Eliminado Correctamente",
						datos: admin
					});
				});
			}
		});
	});

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};






