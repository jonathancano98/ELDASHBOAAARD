import { Component, OnInit } from '@angular/core';
import {SesionService, PeticionesAPIService, CalculosService} from '../../../servicios/index';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-juego-de-memorama-seleccionado-activo',
  templateUrl: './juego-de-memorama-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-memorama-seleccionado-activo.component.scss']
})
export class JuegoDeMemoramaSeleccionadoActivoComponent implements OnInit {

  constructor( private calculos: CalculosService,
    private sesion: SesionService,
    private peticionesAPI: PeticionesAPIService,
     ) { }

displayedColumnsAlumnos: string[] = ['posicion', 'nombreAlumno', 'primerApellido', 'segundoApellido', 'puntuacion','tiempo'];

  juegoSeleccionado:any;
  
  idjuegomemorama:any;
  alumnosDelJuego:any;
  listaAlumnosOrdenadaPorPuntos:any;
  rankingJuegoDePuntos:any;
  datasourceAlumno:any;

  ngOnInit() {

    this.juegoSeleccionado= this.sesion.DameJuego();
    console.log(this.juegoSeleccionado);

    console.log(this.juegoSeleccionado.id);


    this.DameInfoAlumnosJuegoDeMemorama();

  }

  async DameInfoAlumnosJuegoDeMemorama(){
    
    this.alumnosDelJuego = await this.peticionesAPI.DameInfoAlumnosJuegoDeMemorama(this.juegoSeleccionado.id).toPromise();
    
    
    
    this.DamealumnosjuegoMemorama();

  }
  
  DamealumnosjuegoMemorama(){
    this.peticionesAPI.DamealumnosjuegoMemorama(this.juegoSeleccionado.id).subscribe(alumnos =>{
      console.log(alumnos);
      this.listaAlumnosOrdenadaPorPuntos = alumnos;
      // ordena la lista por puntos
      this.listaAlumnosOrdenadaPorPuntos = this.listaAlumnosOrdenadaPorPuntos.sort(function(obj1, obj2) {
        return obj2.puntuacion - obj1.puntuacion;

      });

      this.TablaClasificacionTotal();

    })

  }

 

  TablaClasificacionTotal(){

    console.log(this.alumnosDelJuego,this.listaAlumnosOrdenadaPorPuntos);

    this.rankingJuegoDePuntos = this.calculos.PrepararTablaRankingIndividualMemorama(this.listaAlumnosOrdenadaPorPuntos,this.alumnosDelJuego);
      console.log ('Ya tengo la tabla');
      console.log(this.rankingJuegoDePuntos);
      // tslint:disable-next-line:max-line-length
     // this.rankingJuegoDePuntosTotal = this.calculos.DameRanking (this.listaAlumnosOrdenadaPorPuntos, this.alumnosDelJuego, this.nivelesDelJuego);
      this.datasourceAlumno = new MatTableDataSource(this.rankingJuegoDePuntos);

  }


}
