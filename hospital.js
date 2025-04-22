const { MongoClient, ServerApiVersion } = require('mongodb');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const uri = 'mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos';

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let usuariosHospital = [];

async function run() {
    try {
        await client.connect();
        await client.db("hospital").command({ ping: 1 });
        console.log("OKOK CONECTADA!");
        const collection = client.db("hospital").collection("usuarios");
        usuariosHospital = await collection.find().toArray();
        
        //console.log(usuariosHospital);
        
    } finally {
        await client.close();
    }
}

function leeMenu(question) {
    return new Promise((resolve) => {
        rl.question(question, (respuesta) => {
            resolve(respuesta);
        });
    });
}

async function menu1() {
    let opcion = 0;

    while (opcion !== 2) {
        console.log("\nINICIAR SESION");
        console.log("1. Iniciar sesion");
        console.log("2. Salir");
        opcion = parseInt(await leeMenu("Seleccione opción: "));

        switch (opcion) {
            case 1:
                let nombre = await leeMenu("Introduce tu nombre de usuario: ");
                let contra = await leeMenu("Introduce tu contraseña: ");
                let usuarioEncontrado;

                for (let i = 0; i < usuariosHospital.length; i++) {
                    if (nombre===usuariosHospital[i].usuario && contra===usuariosHospital[i].contra) {
                        usuarioEncontrado=usuariosHospital[i];
                        console.log(usuarioEncontrado);
                        break;
                    }else{
                        //console.log("Nombre o contraseña incorrecta");
                    }
                }

                if (usuarioEncontrado) {
                    if (usuarioEncontrado.rol==="admin") {
                        await menuAdmin(nombre);
                    }else if(usuarioEncontrado.rol==="administrativo"){
                        await menuAdministrativo(nombre);
                    }else{
                        console.log("No existe ese rol");
                    }

                }else{
                    console.log("nombre o contraseña incorrecta");
                    
                }
                break;
            case 2:
                console.log("Saliendo del menú");
                rl.close();
                break;
            default:
                console.log("Opción no válida");
                break;
        }
    }
}

//MENU DE ADMIN
async function menuAdmin(nombre) {
    let opcion2=0;
    
    while (opcion2 !==2) {
        console.log("\n Bienvenido  "+ nombre);
        console.log("1. Crear especialista");
        console.log("2. Salir");
        opcion2 = parseInt(await leeMenu("Seleccione opción: "));
        switch (opcion2) {
            case 1:
                await crearEspecialista();
                break;
            case 2:
                console.log("Saliendo...");
                await menu1();
                break;
        
            default:
                console.log("Opción no válida");
                break;
        }
    }
}



//MENU DE ADMINISTRATIVOS.
async function menuAdministrativo(nombre) {
    
    let opcion=0;
    while (opcion !=6) {
        console.log("\nBienvenido "+ nombre);
        console.log("1. Crear paciente");
        console.log("2. historialCitas");
        console.log("3. Añadir cita");
        console.log("4. Editar cita(asistio o no)");
        console.log("5. Filtro");
        console.log("6. Salir");
        opcion = parseInt(await leeMenu("Seleccione opción: "));
        switch (opcion) {
            case 1:
                await crearPaciente();
                console.log("administrativo");
                break;
            case 2:
                await citasUsuarioSelec();
                break;
            case 3:
                await darCita();
                await menuAdministrativo(nombre);
                break;

            case 4:
                await cambiarCita();
                await menuAdministrativo(nombre);
                break;

            case 5:
                await Filtro();
                await menuAdministrativo(nombre);
                break;
            case 6:
            console.log("saliendo...");
            await menu1();
                break;
            default:
                break;
        }
    }
}


// crear paciente.
async function crearPaciente() {
    const uri = 'mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos';
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const collection = client.db("hospital").collection("pacientes");

        // Pedir datos
        let nuevoNombre = await leeMenu("Nuevo nombre del paciente: ");
        let nuevoApellido = await leeMenu("Nuevo apellido del paciente: ");
        let nuevoDireccion = await leeMenu("Dirección del paciente: ");
        let nuevoTelefono = await leeMenu("Teléfono del paciente: ");
        
        // Creamos el objeto NuevoPaciente
        let nuevoPaciente = {
            nombre: nuevoNombre,
            apellido: nuevoApellido,
            telefono: nuevoTelefono,
            direccion: nuevoDireccion,
        };

        // Insertamos en MongoDB
        await collection.insertOne(nuevoPaciente);
        
        console.log("Se ha creado al paciente:", nuevoPaciente);
        
    } catch (err) {
        console.error("nono"+ err);
    } finally {
        await client.close();
    }
}


async function crearEspecialista() {
    const uri = 'mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos';
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const collection = client.db("hospital").collection("especialista");
        
        // Pedir datos.
        
        let nuevoNombre = await leeMenu("Nuevo nombre del especialista: ");
        let nuevoProfesion = await leeMenu("Nueva Profesion: ");
    
        // Creamos el objeto NuevoPaciente.
        let nuevoEspecialista= {
            nombre: nuevoNombre,
            profesion: nuevoProfesion,
        };

        // Insertamos en MongoDB
        await collection.insertOne(nuevoEspecialista);
        console.log("Se ha creado al especialista:", nuevoEspecialista);
        
    } catch (err) {
        console.error("nono"+ err);
    } finally {
        await client.close();
    }
}

async function darCita() {
    const uri = 'mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos';
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const citas = client.db("hospital").collection("citas");
        const pacientes = client.db("hospital").collection("pacientes");
        let listaPacientes = await pacientes.find().toArray();
        let id=1;
        console.log("Lista de pacientes:");

         //console.log(listaPacientes);
        for (let i = 0; i < listaPacientes.length; i++) {
            console.log(`${id++}. ${listaPacientes[i].nombre} ${listaPacientes[i].apellido}`);
        }

        
        let seleccion = parseInt(await leeMenu("Selecciona el número del paciente: "));
        if (isNaN(seleccion) || seleccion < 0 || seleccion >= pacientes.length) {
            console.log("Selección inválida.");
            return;
        }

        const pacienteSeleccionado = listaPacientes[seleccion -1];

        let dia = await leeMenu("Día de la cita: ");
        let mes = await leeMenu("Mes de la cita: ");
        let año = await leeMenu("Año de la cita: ");

        let fechaCita = new Date(año, mes - 1, dia); // mes - 1 porque van de 0 a 11
        let pendiente="pendiente";

        let cita = {
            nombrePaciente: `${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}`,
            fecha: fechaCita.toLocaleDateString(),
            codigoPaciente:pacienteSeleccionado._id,
            asistio: pendiente
        };

        await citas.insertOne(cita);

        console.log("Cita guardada correctamente:", cita);
        
    } catch (err) {
        console.error("nono"+ err);
    } finally {
        await client.close();
    }

}

async function citasUsuarioSelec() {
    const uri = 'mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos';
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const citas = client.db("hospital").collection("citas");
        const pacientes = client.db("hospital").collection("pacientes");
        let listaPacientes = await pacientes.find().toArray();
        let listacitas = await citas.find().toArray();
        
        let id=1;
        console.log("Lista de pacientes:");

        for (let i = 0; i < listaPacientes.length; i++) {
            console.log(`${id++}. ${listaPacientes[i].nombre} ${listaPacientes[i].apellido}`);
        }

        let seleccion = parseInt(await leeMenu("Selecciona el número del paciente: "));
        if (isNaN(seleccion) || seleccion <= 0 || seleccion > listaPacientes.length) {
            console.log("Selección inválida.");
            return;
        }

        const pacienteSeleccionado = listaPacientes[seleccion -1];
        
        
        let nId=1;
        for (let i = 0; i < listacitas.length; i++) {

           if (pacienteSeleccionado._id.toString() === listacitas[i].codigoPaciente.toString()) {
                console.log(`${nId++}. Nombre:${listacitas[i].nombrePaciente}, fecha:${listacitas[i].fecha}, asistio:${listacitas[i].asistio}`);
                
            }
        
            
        }
        
        
        
    } catch (err) {
        console.error("nono"+ err);
    } finally {
        await client.close();
    }
}


async function cambiarCita() {
    const uri = 'mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos';
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {

        await client.connect();
        const citas = client.db("hospital").collection("citas");
        let listacitas = await citas.find().toArray();
        let id=1;
        console.log("\nLista de Citas:");
        
        
        for (let i = 0; i < listacitas.length; i++) {
            console.log(`${id++}. Nombre del paciente: ${listacitas[i].nombrePaciente}, Fecha: ${new Date(listacitas[i].fecha).toLocaleDateString()}`);
        }

        let seleccion = parseInt(await leeMenu("Selecciona la cita: "));
        if (isNaN(seleccion) || seleccion <= 0 || seleccion > listacitas.length) {
            console.log("Selección inválida.");
            return;
        }

        const citaSelecionada = listacitas[seleccion -1];
        const asistencia = await leeMenu("¿Asistió el paciente? (s/n): ");
        const asistio = asistencia.toLowerCase() === 's';

        await citas.updateOne(
            { _id: citaSelecionada._id },         
            { $set: { asistio: asistio } }
        );
        
    } catch (err) {
        console.error("nono"+ err);
    } finally {
        await client.close();
    }
}


async function Filtro() {
    let opcion=0;


    while (opcion!=5) {
        console.log("\n1. Filtrara por dia");
        console.log("2. Filtrara por mes");
        console.log("3. Filtrara por año");
        console.log("4. Filtrara por rango");
        console.log("5. Salir");

        opcion = parseInt(await leeMenu("Seleccione opción: "));
        switch (opcion) {
            case 1:
                await filtrarPorDia();
                break;
            case 2:

                break;
            case 3:

                break;
            case 4:

                break;
            case 5:

                break;    
            default:
                break;
        }
    }



}
async function filtrarPorDia() {
    const uri = 'mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/?retryWrites=true&w=majority&appName=alumnos';
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        const citas = client.db("hospital").collection("citas");

        let filtroDia = parseInt(await leeMenu("Selecciona el número de día (1-31): "));
        if (isNaN(filtroDia) || filtroDia < 1 || filtroDia > 31) {
            console.log("Día inválido.");
            return;
        }

        const listacitas = await citas.find().toArray();

        const citasFiltradas = listacitas.filter(cita => {
            const fecha = new Date(cita.fecha);
            return fecha.getDate() === filtroDia;
        });

        console.log(citasFiltradas);
        
        if (citasFiltradas.length === 0) {
            console.log(`No hay citas para el día ${filtroDia}.`);
        } else {
            console.log(`Citas para el día ${filtroDia}:`);
            for (let i = 0; i < citasFiltradas.length; i++) {
                
                console.log(`${i + 1}. ${citasFiltradas[i].nombrePaciente} - ${citasFiltradas[i].fecha}`);
                
            }
        }

    } catch (err) {
        console.error("Error: " + err);
    } finally {
        await client.close();
    }
}


async function iniciarPrograma() {
    await run();
    await menu1();
}

iniciarPrograma();
