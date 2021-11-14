export class JuegoMEMORAMA {

[x: string]: any;
    Tipo: string;
    Modo: string;
    Asignacion: string;
    JuegoActivo: boolean;
    grupoId: number;
    id: number;
    familiaId:number;
    TipoJuegoCompeticion: string;
    NumeroParticipantesPuntuan: number;
    Puntos: number[];
    NombreJuego: string;
    PuntuacionCorrecta: number;
    PuntuacionIncorrecta: number;
    Presentacion: string;
    JuegoTerminado: boolean;
    profesorId: number;
    cuestionarioId: number;
  
    constructor(Tipo?: string, Modo?: string,familiaId?:number, JuegoActivo?: boolean, NombreJuego?: string ) 
    {
  
      this.Tipo = Tipo;
      this.Modo = Modo;
      this.JuegoActivo = JuegoActivo;
      this.familiaId = familiaId;
     
      this.NombreJuego = NombreJuego;
    }
}