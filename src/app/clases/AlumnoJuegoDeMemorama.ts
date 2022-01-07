export class AlumnoJuegoDeMemorama {

    alumnoId: number;
    juegoDeMemoramaId: number;
    id: number;
    puntuacion:number;
  
    constructor(alumnoId?: number, juegoDePuntosId?: number, puntuacion?:number) {
  
      this.alumnoId = alumnoId;
      this.juegoDeMemoramaId = juegoDePuntosId;
      this.puntuacion = puntuacion;
  
    }
  }
  