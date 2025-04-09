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
                for (let i = 0; i < usuariosHospital.length; i++) {
                    if (nombre===usuariosHospital[i].usuario && contra===usuariosHospital[i].contraseña && usuariosHospital[i].rol=="admin"  ) {
                        await menuAdmin(nombre);
                        
                    }else if (nombre===usuariosHospital[i].usuario && contra===usuariosHospital[i].contraseña && usuariosHospital[i].rol=="administrativo"  ) {
                        await menuAdministrativo(nombre);
                    }else{
                        console.log("Nombre o contraseña incorrecta");
                    }
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
        console.log("1. Dar de alta");
        console.log("2. Salir");
        opcion2 = parseInt(await leeMenu("Seleccione opción: "));
        switch (opcion2) {
            case 1:
                console.log("dar de alta");
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
        console.log("\nBienvenido"+ nombre);
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







async function iniciarPrograma() {
    await run(); // Espera a que se conecte y se carguen los datos
    await menu1(); // Luego muestra el menú
}

iniciarPrograma();
