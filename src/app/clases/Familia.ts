export class Familia {
    Nombre: string;
    ImagenFamilia: string;
    Publica: boolean;
    DosCaras: boolean;
    id: number;
    profesorId: number;
  
    constructor(nombre?: string, imagenFamilia?: string, dosCaras?: boolean, profesorId?: number) {
  
      this.Nombre = nombre;
      this.ImagenFamilia= imagenFamilia;
      this.DosCaras = dosCaras;
      this.profesorId = profesorId;
      this.Publica = false;
    }
  }
  