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
        if (isNaN(seleccion) || seleccion < 0 || seleccion >= pacientes.length) {
            console.log("Selección inválida.");
            return;
        }

        const pacienteSeleccionado = listaPacientes[seleccion -1];
        
        
        let citasPacienteSelec=[];
        for (let i = 0; i < listacitas.length; i++) {
        //    if (pacienteSeleccionado._id==listacitas[i].codigoPaciente) {
        //         citasPacienteSelec.push(listacitas[i]);
        //    }
           if (pacienteSeleccionado._id.toString() === listacitas[i].codigoPaciente.toString()) {
            citasPacienteSelec.push(listacitas[i]);
            }
        
            
        }
        console.log(citasPacienteSelec);
        

        
        
    } catch (err) {
        console.error("nono"+ err);
    } finally {
        await client.close();
    }
}