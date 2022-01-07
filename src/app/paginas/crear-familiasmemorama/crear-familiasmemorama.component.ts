import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as URL from 'src/app/URLs/urls';
// Imports para abrir diálogo confirmar eliminar equipo
import { MatDialog, MatTabGroup } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';




// Servicios
import { SesionService, PeticionesAPIService, CalculosService } from '../../servicios/index';

// Clases
import { Coleccion, Cromo } from '../../clases/index';
import { Familia } from 'src/app/clases/Familia';
import{ Carta } from 'src/app/clases/Carta';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import 'rxjs';

import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import { Observable} from 'rxjs';
import Swal from 'sweetalert2';

export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}


@Component({
  selector: 'app-crear-familiasmemorama',
  templateUrl: './crear-familiasmemorama.component.html',
  styleUrls: ['./crear-familiasmemorama.component.scss']
})

export class CrearFamiliasmemoramaComponent implements OnInit {
// Para el paso finalizar limpiar las variables y volver al mat-tab de "Lista de equipos"
//@ViewChild('stepper') stepper;
@ViewChild('stepper') private stepper: MatStepper;

@ViewChild('tabs') tabGroup: MatTabGroup;
myForm: FormGroup;
myForm2: FormGroup;
myForm3: FormGroup;



// CREAR COLECCION
imagenColeccion: string;
coleccionCreada: Coleccion;
nombreColeccion: string;

// CREAR CROMO
nombreCromo: string;
probabilidadCromo: string;
nivelCromo: string;
imagenCromoDelante: string;
imagenCromoDetras: string;
cromosAgregados: Carta [] = [];
// tslint:disable-next-line:ban-types
isDisabledCromo: Boolean = true;

// COMPARTIDO
profesorId: number;
nombreImagen: string;
file: File;

nombreImagenCromoDelante: string;
nombreImagenCromoDetras: string;
fileCromoDelante: File;
fileCromoDetras: File;

// Al principio coleccion no creada y imagen no cargada
// tslint:disable-next-line:ban-types
coleccionYaCreada: Boolean = false;

// tslint:disable-next-line:ban-types
imagenCargado: Boolean = false;
// tslint:disable-next-line:ban-types
imagenCargadoCromo: Boolean = false;

// tslint:disable-next-line:ban-types
finalizar: Boolean = false;

dosCaras;
NecessitaRelacion;
infoColeccion;
ficherosColeccion;
coleccion;
advertencia = true;
idfamiliacreada:any;

vectorcartas:any[]=[];
vectorcartas2:any[]=[];

vectorimagen: any[] =[];

vectorcartaseleccionadas:any[]=[];
pasarvectorcartaseleccionadas:any[]=[];

cartaseleccionada1:any;
pasarcartaseleccionada1:any;

cartaseleccionada2:any;
pasarcartaseleccionada2:any;

cartasquevoyaagregarafamilia: any[]=[];


relacion: Boolean = false;




// PONEMOS LAS COLUMNAS DE LA TABLA Y LA LISTA QUE TENDRÁ LA INFORMACIÓN QUE QUEREMOS MOSTRAR
displayedColumns: string[] = ['nombreCromo', ' '];

ficherosRepetidos: string[];
errorFicheros = false;
  nombreCarta: string;

constructor(
  private router: Router,
  public dialog: MatDialog,
  public sesion: SesionService,
  public peticionesAPI: PeticionesAPIService,
  public calculos: CalculosService,
  public location: Location,
  private formBuilder: FormBuilder) { }

  ngOnInit() {
    // REALMENTE LA APP FUNCIONARÁ COGIENDO AL PROFESOR DEL SERVICIO, NO OBSTANTE AHORA LO RECOGEMOS DE LA URL
    // this.profesorId = this.profesorService.RecibirProfesorIdDelServicio();
    this.profesorId = this.sesion.DameProfesor().id;


    // Constructor myForm
    this.myForm = this.formBuilder.group({
     nombreColeccion: ['', Validators.required]
    });
    this.myForm2 = this.formBuilder.group({
      nombreCromo : ['', Validators.required]
     });
     this.myForm3 = this.formBuilder.group({
      nombreCarta : ['', Validators.required]
     });
  }

  goBack(stepper: MatStepper){
    stepper.previous();
}

goForward(stepper: MatStepper){
    stepper.next();
}

  pr() {
    console.log('hoo');
  }

  
   async seleccionarcartas(){

    // Si me falla algo puedo hacerlo con la linea comentada abajo 

    // this.vectorcartas= await this.peticionesAPI.DameCartasFamilia(this.idfamiliacreada).toPromise();
    this.peticionesAPI.DameCartasFamilia(this.idfamiliacreada).subscribe( cartas =>{

      this.vectorcartas= cartas;
      console.log (this.vectorcartas);
      this.preparaimagenes();
    })

    console.log("VEEEEECTOOOR CAAARTAS  1 y 2 ",this.vectorcartas);

    // this.preparaimagenes();

  }
  preparaimagenes(){

    console.log("VECTORCRTAS:",this.vectorcartas);
    console.log("LONGITUD VECTORCRTAS:",this.vectorcartas.length);

    for (let i = 0; i < this.vectorcartas.length; i++) {
      
      const elem = this.vectorcartas[i];
      console.log("URL:",URL.ImagenesCartas);
      console.log("elem",elem.imagenDelante);
      this.vectorimagen[i] = URL.ImagenesCartas + elem.imagenDelante;
                      
    }
     console.log(this.vectorimagen);

  }


  // Creamos una coleccion dandole un nombre y una imagen
  CrearFamilia() {

    let nombreFamilia: string;

    //Recojemos Nombre
    nombreFamilia = this.myForm.value.nombreColeccion;
    console.log('Entro a crear la familia ' + nombreFamilia);
    console.log(this.nombreImagen);

    this.peticionesAPI.CreaFamilia (new Familia(nombreFamilia, this.nombreImagen, this.dosCaras,undefined,this.NecessitaRelacion), this.profesorId)

    .subscribe((res) => {
      if (res != null) {
        console.log ("Familia CREADA:", res.id ,res);
        this.idfamiliacreada = res.id;
        console.log(res);
        this.coleccionYaCreada = true; // Si tiro atrás y cambio algo se hará un PUT y no otro POST
        this.coleccionCreada = res; // Lo metemos en coleccionCreada, y no en coleccion!!
        // Hago el POST de la imagen SOLO si hay algo cargado. Ese boolean se cambiará en la función ExaminarImagen
        if (this.imagenCargado === true) {

          // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagen
          const formData: FormData = new FormData();
          formData.append(this.nombreImagen, this.file);
          this.peticionesAPI.PonImagenFamiliaMemorama(formData)
          .subscribe(() => console.log('Imagen cargado'));
        }
        console.log ('He creado la colección ' + this.coleccionCreada.id);

      } else {
        console.log('Fallo en la creación');
      }
    });
  }

  // Si estamos creando la coleccion y pasamos al siguiente paso, pero volvemos hacia atrás para modificar el nombre y/o el
  // imagen, entonces no deberemos hacer un POST al darle a siguiente, sino un PUT. Por eso se hace esta función, que funciona
  // de igual manera que la de Crear Equipo pero haciendo un PUT.
  EditarFamilia() {

    console.log('Entro a editar');
    let nombreColeccion: string;

    // RECOJEMOS EL NOMBRE PUESTO EN WEB
    nombreColeccion = this.myForm.value.nombreColeccion;

    this.peticionesAPI.ModificaColeccion(new Coleccion(nombreColeccion, this.nombreImagen), this.profesorId, this.coleccionCreada.id)
    .subscribe((res) => {
      if (res != null) {
        console.log('Voy a editar la coleccion con id ' + this.coleccionCreada.id);
        this.coleccionCreada = res;

        // Hago el POST de la imagen SOLO si hay algo cargado
        if (this.imagenCargado === true) {
          // HACEMOS EL POST DE LA NUEVA IMAGEN EN LA BASE DE DATOS
          const formData: FormData = new FormData();
          formData.append(this.nombreImagen, this.file);
          this.peticionesAPI.PonImagenColeccion(formData)
          .subscribe(() => console.log('Imagen cargada'));
        }

      } else {
        console.log('fallo editando');
      }
    });
  }

  CartaSeleccionada(i){


    console.log("CARTA SELECCIONADA",i);
    let carta = document.getElementById('carta'+i);
    console.log(this.vectorcartas[i]);
    this.vectorcartaseleccionadas.push(this.vectorcartas[i]);
    console.log("CARTAS SIN SELECCIONAR:",this.cartaseleccionada1,this.cartaseleccionada2);

    if(this.cartaseleccionada1 === undefined)
    {
      carta.style.border="5px solid red";
      this.cartaseleccionada1=carta;
      console.log("CARTA1",this.cartaseleccionada1)

    }
    else{
      this.cartaseleccionada2=carta;
      console.log("CARTA2",this.cartaseleccionada2)
    }


    console.log("CARTAS SELECCIONADAS:",this.cartaseleccionada1,this.cartaseleccionada2);

    // for(let i=0;this.vectorcartaseleccionadas.length<2;i++){

    //   this.cartaseleccionada1 === undefined;
    //   this.cartaseleccionada2 === undefined;

      
    //   if(this.cartaseleccionada1 === undefined)
    //   {
    //     carta.style.border="5px solid red";
    //     this.cartaseleccionada1=carta;
    //     console.log("CARTA1",this.cartaseleccionada1)
  
    //   }
    //   if(this.cartaseleccionada2 === undefined){
    //     this.cartaseleccionada2=carta;
    //     console.log("CARTA2",this.cartaseleccionada2)
    //   }

    //   this.vectorcartaseleccionadas[i].push(this.cartaseleccionada1,this.cartaseleccionada2);
    //   console.log(this.vectorcartaseleccionadas);


    // }


    if (this.cartaseleccionada2 != undefined){

      

      if(this.cartaseleccionada1 == this.cartaseleccionada2){

      console.log("MISMA CARTA")
      carta.style.border="";

      }

      else{
        console.log("DIFERENTE CARTA")
        carta.style.border="5px solid red";

        this.pasarcartaseleccionada1=this.cartaseleccionada1;
        this.pasarcartaseleccionada2=this.cartaseleccionada2;
        this.pasarvectorcartaseleccionadas=this.vectorcartaseleccionadas;

        // this.EstableceRelacion(this.pasarcartaseleccionada1,this.pasarcartaseleccionada2,this.pasarvectorcartaseleccionadas);
        this.vectorcartaseleccionadas= [];

      }

      this.cartaseleccionada1 = undefined;
      this.cartaseleccionada2 = undefined;
      console.log("CARTAS UNDEFINED:",this.cartaseleccionada1,this.cartaseleccionada2);


    }

    

    console.log(this.vectorcartaseleccionadas); 
   }


   EstableceRelacion(){

   console.log("Carta1",this.pasarcartaseleccionada1,"Carta2",this.pasarcartaseleccionada2,"Vector Cartas Seleccionadas",this.pasarvectorcartaseleccionadas);
   this.pasarcartaseleccionada1.style.border="";
   this.pasarcartaseleccionada2.style.border="";

   this.pasarcartaseleccionada1.style.visibility= "hidden";
   this.pasarcartaseleccionada2.style.visibility= "hidden";

   // Tengo que hacer un PUT (MODIFICACION)
   let cartarel1:Carta;
   let cartarel2:Carta;

   cartarel1 = new Carta(this.pasarvectorcartaseleccionadas[0].Nombre,this.pasarvectorcartaseleccionadas[0].imagenDelante,this.pasarvectorcartaseleccionadas[0].imagenDetras,this.pasarvectorcartaseleccionadas[0].familiaId,this.pasarvectorcartaseleccionadas[0].id,this.pasarvectorcartaseleccionadas[1].id);
   cartarel2 = new Carta(this.pasarvectorcartaseleccionadas[1].Nombre,this.pasarvectorcartaseleccionadas[1].imagenDelante,this.pasarvectorcartaseleccionadas[1].imagenDetras,this.pasarvectorcartaseleccionadas[1].familiaId,this.pasarvectorcartaseleccionadas[1].id,this.pasarvectorcartaseleccionadas[0].id);
   
  //  this.peticionesAPI.ModificaCarta(cartarel1,this.pasarvectorcartaseleccionadas[0].id);
   this.peticionesAPI.ModificaCarta(cartarel2,this.pasarvectorcartaseleccionadas[1].id).subscribe( cartilla =>{
     console.log(cartilla);
   });
   this.peticionesAPI.ModificaCarta(cartarel1,this.pasarvectorcartaseleccionadas[0].id).subscribe( cartilla2 =>{
    console.log(cartilla2);
  });

   console.log("RELACIONES",cartarel1,cartarel2);
   this.pasarvectorcartaseleccionadas=[];


     
   }


  // Creamos una cromo y lo añadimos a la coleccion dandole un nombre, una probabilidad, un nivel y una imagen
  AgregarCartaFamilia() {
    
    let nombreCromo: string;

    nombreCromo = this.myForm2.value.nombreCromo;

    console.log("Entro a asignar la carta",nombreCromo+ "a la coleccionID",this.coleccionCreada.id);
   
    let Cartaparaagregar:Carta;
    Cartaparaagregar = new Carta(nombreCromo ,this.nombreImagenCromoDelante, this.nombreImagenCromoDetras,undefined,undefined,undefined);

    // this.cartasquevoyaagregarafamilia.push(Cartaparaagregar);

    // console.log("Vector cartas que agregaré:",this.cartasquevoyaagregarafamilia);

    this.peticionesAPI.PonCartaFamilia(Cartaparaagregar,this.coleccionCreada.id)
    .subscribe((res) => { 

        if (res != null) {
          console.log('asignado correctamente');
          // Añadimos el cromo a la lista
          this.cromosAgregados.push(res);
          this.cromosAgregados = this.cromosAgregados.filter(result => result.Nombre !== '');
          // this.CromosAgregados(res);

          // Hago el POST de la imagen de delante SOLO si hay algo cargado.
          if (this.imagenCromoDelante !== undefined) {

            // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
            const formData: FormData = new FormData();
            formData.append(this.nombreImagenCromoDelante, this.fileCromoDelante);
            this.peticionesAPI.PonImagenCarta(formData)
            .subscribe(() => console.log('Imagen cargado'));
          }

          // Hago el POST de la imagen de detras SOLO si hay algo cargado.
          if (this.imagenCromoDetras !== undefined) {

            // Hacemos el POST de la nueva imagen en la base de datos recogida de la función ExaminarImagenCromo
            const formData: FormData = new FormData();
            formData.append(this.nombreImagenCromoDetras, this.fileCromoDetras);
            this.peticionesAPI.PonImagenCarta(formData)
            .subscribe(() => console.log('Imagen cargado'));
          }

          this.LimpiarCampos();
        } else {
          console.log('fallo en la asignación');
        }
      });
  }


  // Utilizamos esta función para eliminar un cromo de la base de datos y de la lista de añadidos recientemente
  BorrarCromo(carta: Carta) {
    console.log('Id cromo ' + this.coleccionCreada.id);
    this.peticionesAPI.BorrarCarta(carta.id)
    .subscribe(() => {
      // Elimino el cromo de la lista
      this.cromosAgregados = this.cromosAgregados.filter(res => res.id !== carta.id);
      console.log('Cromo borrado correctamente');
    });

    this.peticionesAPI.BorrarImagenCarta (carta.imagenDelante).subscribe();
    if (carta.imagenDetras !== undefined) {
      this.peticionesAPI.BorrarImagenCarta (carta.imagenDetras).subscribe();
    }
  }

  // Activa la función ExaminarImagenColeccion
  ActivarInputColeccion() {
    console.log('Activar input');
    document.getElementById('inputColeccion').click();
  }

  // Activa la función ExaminarImagenCromoDelante
  ActivarInputCartaDelante() {
    console.log('Activar input');
    document.getElementById('inputCromoDelante').click();
  }

    // Activa la función ExaminarImagenCromoDetras
  ActivarInputCartaDetras() {
      console.log('Activar input');
      document.getElementById('inputCromoDetras').click();
  }


  // Buscaremos la imagen en nuestro ordenador y después se mostrará en el form con la variable "imagen" y guarda el
  // nombre de la foto en la variable nombreImagen

  ExaminarImagenFamilia($event) {
    this.file = $event.target.files[0];
    console.log('fichero ' + this.file.name);
    this.nombreImagen = this.file.name;
   // this.nombreImagenCromo = this.file.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {

      console.log('ya he cargado la imagen de la familia');
      this.imagenCargado = true;
      this.imagenColeccion = reader.result.toString();
    };
  }

  ExaminarImagenCartaDelante($event) {
    this.fileCromoDelante = $event.target.files[0];

    console.log('fichero ' + this.fileCromoDelante.name);
    this.nombreImagenCromoDelante = this.fileCromoDelante.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileCromoDelante);
    reader.onload = () => {
      console.log('ya Cromo');
      // this.imagenCargadoCromo = true;
      this.imagenCromoDelante = reader.result.toString();
    };
  }

  ExaminarImagenCartaDetras($event) {
    this.fileCromoDetras = $event.target.files[0];

    console.log('fichero ' + this.fileCromoDetras.name);
    this.nombreImagenCromoDetras = this.fileCromoDetras.name;

    const reader = new FileReader();
    reader.readAsDataURL(this.fileCromoDetras);
    reader.onload = () => {
      console.log('ya Cromo');
      // this.imagenCargadoCromo = true;
      this.imagenCromoDetras = reader.result.toString();
    };
  }





  // Limpiamos los campos del cromo
  LimpiarCampos() {
      this.nombreCromo = undefined;
      this.nombreCarta = undefined;
      this.probabilidadCromo = undefined;
      this.nivelCromo = null;
      this.isDisabledCromo = true;
      this.imagenCargadoCromo = false;
      this.imagenCromoDelante = undefined;
      this.nombreImagenCromoDelante = undefined;
      this.imagenCromoDetras = undefined;
      this.nombreImagenCromoDetras = undefined;
     // this.opcionSeleccionadaProbabilidad = null;
  }

  // Esta función se utiliza para controlar si el botón de siguiente del stepper esta desativado.
  // Si en alguno de los inputs no hay nada, esta disabled. Sino, podremos clicar.
  Disabled() {

  if (this.nombreCromo === undefined || this.probabilidadCromo === undefined || this.nivelCromo === undefined ||
        this.nivelCromo === '' || this.probabilidadCromo === '' || this.nivelCromo === null) {
        this.isDisabledCromo = true;
  } else {
        this.isDisabledCromo = false;
    }
  }
    // Función que se activará al clicar en finalizar el último paso del stepper
  Finalizar() {
      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.myForm.reset();
      this.myForm2.reset();
      this.stepper.reset();

      // Tambien limpiamos las variables utilizadas para crear el nueva coleccion, por si queremos crear otra.
      this.coleccionYaCreada = false;
      this.imagenCargado = false;
      this.imagenColeccion = undefined;
      this.imagenCargadoCromo = false;
      this.imagenCromoDelante = undefined;
      this.imagenCromoDetras = undefined;
      this.coleccionCreada = undefined;
      this.dosCaras = undefined;
      this.cromosAgregados = [];
      this.finalizar = true;
      Swal.fire('Coleccion creada con éxito', '', 'success');
      this.router.navigate(['/inicio/' + this.profesorId]);


  }

  canExit(): Observable <boolean> {
    if (!this.coleccionYaCreada || this.finalizar) {
      return of (true);
    } else {
      const confirmacionObservable = new Observable <boolean>( obs => {
          const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
            height: '150px',
            data: {
              mensaje: 'Confirma que quieres abandonar el proceso de creación de coleccion',
            }
          });

          dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
              // Si confirma que quiere salir entonces eliminamos el grupo que se ha creado
              // this.sesion.TomaGrupo (this.grupo);
              // this.calculos.EliminarGrupo();
              this.BorrarColeccion (this.coleccionCreada).subscribe ( () => obs.next (confirmed));
            } else {
              obs.next (confirmed);
            }
          });
      });
      return confirmacionObservable;
    }
  }

  // Utilizamos esta función para eliminar una colección de la base de datos y actualiza la lista de colecciones
  // Retornamos un observable para que el que la llame espere hasta que se haya completado la eliminación
  // en la base de datos.
  BorrarColeccion(coleccion: Coleccion): any {
    const eliminaObservable = new Observable ( obs => {


        this.peticionesAPI.BorraColeccion(coleccion.id, coleccion.profesorId)
        .subscribe( () => { console.log ('Ya he borrado la coleccion');
                            this.peticionesAPI.BorrarImagenColeccion(coleccion.ImagenColeccion).subscribe();
                            for (let i = 0; i < (this.cromosAgregados.length); i++) {
                                this.peticionesAPI.BorrarCromo (this.cromosAgregados[i].id).subscribe();
                                this.peticionesAPI.BorrarImagenCromo(this.cromosAgregados[i].imagenDelante).subscribe();
                                if (this.cromosAgregados[i].imagenDetras !== undefined) {
                                  this.peticionesAPI.BorrarImagenCromo(this.cromosAgregados[i].imagenDetras).subscribe();
                                }
                            }
                            obs.next();
        });
    });
    return eliminaObservable;
  }


  RegistrarRelacion(){
    console.log("VAMOS A REGISTRAR SI QUIERE RELACION");

    let relacion = document.getElementById('relacion') as HTMLInputElement;
    let sinrelacion =  document.getElementById('sinrelacion') as HTMLInputElement;
    
    if(relacion.checked){
      this.NecessitaRelacion=true;

      console.log("SI QUIERE RELACION");

    }
    else{
      this.NecessitaRelacion=false;
      console.log("NO QUIERE RELACION");

    }
    this.CrearFamilia();

  }

  RegistraNumeroDeCaras() {
    const radio = document.getElementsByName('caras')[0] as HTMLInputElement;
    if (radio.checked ) {
      this.dosCaras = false;
    } else {
      this.dosCaras = true;
    }
    
  }

   // Activa la función SeleccionarInfoColeccion
  ActivarInputInfo() {
    console.log('Activar input');
    document.getElementById('inputInfo').click();
  }

  // Par abuscar el fichero JSON que contiene la info de la colección que se va
  // a cargar desde ficheros
  SeleccionarInfoColeccion($event) {
    const fileInfo = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(fileInfo, 'ISO-8859-1');
    reader.onload = () => {
      try {
        this.infoColeccion = JSON.parse(reader.result.toString());
        this.calculos.VerificarFicherosColeccion (this.infoColeccion)
        .subscribe (lista => {
          if (lista.length === 0) {
            Swal.fire({
              title: 'Selecciona ahora las imagenes de los cromos',
              text: 'Selecciona todos los ficheros de la carpeta imagenes',
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Selecciona'
            }).then((result) => {
              if (result.value) {
                // Activamos la función SeleccionarFicherosCromos
                document.getElementById('inputCromos').click();
              }
            });
          } else {
            this.ficherosRepetidos = lista;
            this.errorFicheros = true;
          }
        });
      } catch (e) {
        Swal.fire('Error en el formato del fichero', '', 'error');
      }
    };
  }

  SeleccionarFicherosCromos($event) {
    this.ficherosColeccion = Array.from($event.target.files);
    // Ya tenemos todos los ficheros de las imagenes
    // Hay que confirmar que no faltan ficheros
    // CONFIRMAR AQUI
    // Cogemos la imagen de la colección para que se muestre
    const fileImagenColeccion = this.ficherosColeccion.filter (f => f.name === this.infoColeccion.ImagenColeccion)[0];

    const reader = new FileReader();
    reader.readAsDataURL(fileImagenColeccion);
    reader.onload = () => {
      this.imagenColeccion = reader.result.toString();
      this.imagenCargado = true;
    };
  }

  RegistrarColeccion() {

    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaColeccion (new Coleccion (this.infoColeccion.Nombre, this.infoColeccion.ImagenColeccion, this.infoColeccion.DosCaras), this.profesorId)
    .subscribe((res) => {
      if (res != null) {
        this.coleccion = res;
        // guardamos la imagen de la colección (si la hay)
        console.log ('miro si registrar imagen colección ' + this.infoColeccion.ImagenColeccion);
        if (this.infoColeccion.ImagenColeccion !== '') {
          console.log ('Si que registro');
          const imagenColeccion = this.ficherosColeccion.filter (f => f.name === this.coleccion.ImagenColeccion)[0];
          const formDataImagen = new FormData();
          formDataImagen.append(this.coleccion.ImagenColeccion, imagenColeccion);
          this.peticionesAPI.PonImagenColeccion (formDataImagen)
          .subscribe(() => console.log('Imagen cargado'));
        }

        // Creamos cada uno de los cromos y guardamos las imagenes delantera (y trasera si la hay)
        this.infoColeccion.cromos.forEach (cromo => {
          this.peticionesAPI.PonCromoColeccion(
            // tslint:disable-next-line:max-line-length
            new Cromo(cromo.nombreCromo , cromo.probabilidadCromo, cromo.nivelCromo, cromo.nombreImagenCromoDelante, cromo.nombreImagenCromoDetras), this.coleccion.id)
            .subscribe((res2) => {
              if (res2 != null) {
                  // Hacemos el POST de la imagen delantera del cromo
                  const formDataDelante: FormData = new FormData();
                  const fileCromoDelante = this.ficherosColeccion.filter (f => f.name === cromo.nombreImagenCromoDelante)[0];
                  formDataDelante.append(cromo.nombreImagenCromoDelante, fileCromoDelante);
                  this.peticionesAPI.PonImagenCromo(formDataDelante)
                  .subscribe(() => console.log('Imagen cargado'));
                 // Hacemos el POST de la imagen trasera del cromo (si la hay)
                  if (this.coleccion.DosCaras) {
                    const formDataDetras = new FormData();
                    const fileCromoDetras = this.ficherosColeccion.filter (f => f.name === cromo.nombreImagenCromoDetras)[0];
                    formDataDetras.append(cromo.nombreImagenCromoDetras, fileCromoDetras);
                    this.peticionesAPI.PonImagenCromo(formDataDetras)
                    .subscribe(() => console.log('Imagen cargado'));
                  }

              } else {
                console.log('fallo en la asignación');
              }
            });

        });
      }
    });
    Swal.fire('Coleccion creada con éxito', '', 'success');
    this.router.navigate(['/inicio/' + this.profesorId + '/misColecciones']);
  }
  Cancelar() {
    this.router.navigate(['/inicio/' + this.profesorId]);
  }



}
