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
        const collection2 = client.db("hospital").collection("pacientes");
        usuariosHospital = await collection.find().toArray();
        pacientes = await collection2.find().toArray();
        //console.log(pacientes);
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
    const collection2 = client.db("hospital").collection("pacientes");
    while (opcion2 !==2) {
        console.log("\n Bienvenido  "+ nombre);
        console.log("1. Dar de alta");
        console.log("2. Salir");
        opcion2 = parseInt(await leeMenu("Seleccione opción: "));
        switch (opcion2) {
            case 1:
                await crearPaciente();
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



//MENU DE ADMINISTRATIVOS
async function menuAdministrativo(nombre) {
    let opcion=0;
    while (opcion !=2) {
        console.log("\nBienvenido "+ nombre);
        console.log("1. administrativo");
        console.log("2. Salir");
        opcion = parseInt(await leeMenu("Seleccione opción: "));
        switch (opcion) {
            case 1:
                console.log("administrativo");
                break;
            case 2:
                console.log("saliendo...");
                await menu1();
                break;
        
            default:
                break;
        }
    }
}


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

        // Pedimos los datoss
        let nuevoNombre = await leeMenu("Nuevo nombre del paciente: ");
        let nuevoApellido = await leeMenu("Nuevo apellido del paciente: ");
        let nuevoDireccion = await leeMenu("Dirección del paciente: ");
        let nuevoTelefono = await leeMenu("Teléfono del paciente: ");

        // Creamos el objeto paciente
        let nuevoPaciente = {
            nombre: nuevoNombre,
            apellido: nuevoApellido,
            telefono: nuevoTelefono,
            direccion: nuevoDireccion
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



async function iniciarPrograma() {
    await run();
    await menu1();
}

iniciarPrograma();
